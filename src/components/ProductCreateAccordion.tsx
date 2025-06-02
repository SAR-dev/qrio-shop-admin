import Select, { MultiValue } from 'react-select';
import { useDataStore } from "../stores/dataStore"
import { createRef, useEffect, useMemo, useState } from "react";
import Creatable from "react-select/creatable";
import Accordion from "./Accordion";
import { api, generateSlug, getImageUrl } from '../helpers';
import RichTextEditor from './RichTextEditor';
import { FaCheckCircle, FaMinus, FaPlus, FaTrash } from 'react-icons/fa';
import { MdError } from 'react-icons/md';
import { constants } from '../constants';
import { pb } from '../contexts/PocketContext';
import { Collections, ImagesResponse } from '../types/pocketbase';
import { useDebounceCallback } from 'usehooks-ts';
import classNames from "classnames";
import { EditorState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';
import { useNotification } from '../contexts/NotificationContext';
import { NotificationType } from '../types/notification';
import GallerySelect from './GallerySelect';
import { LuImagePlus } from 'react-icons/lu';
import { useImageModalStore } from '../stores/imageModalStore';

interface Option {
    value: string;
    label: string;
}

function ProductCreateAccordion() {
    const { summary } = useDataStore()
    const { openImageModal } = useImageModalStore()
    const notification = useNotification()
    const inputRef = createRef<HTMLInputElement>()
    const [isSlugUnq, setIsSlugUnq] = useState(true)
    const [isGalleryOpen, setIsGalleryOpen] = useState(false)

    const [creatingProducts, setCreatingProducts] = useState(false)

    const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
    const [selectedSeries, setSelectedSeries] = useState<Option | null>(null);
    const [selectedTags, setSelectedTags] = useState<MultiValue<Option> | null>(null);
    const [variants, setVariants] = useState<string[]>([])
    const [images, setImages] = useState<ImagesResponse[]>([])
    const [descriptionState, setDescriptionState] = useState<EditorState>(EditorState.createEmpty())

    const categoryList: Array<Option> = useMemo(() => summary.categoryList.map(c => ({ value: c.id, label: c.title })), [summary])
    const seriesList: Array<Option> = useMemo(() => summary.seriesList.map(c => ({ value: c.id, label: c.title })), [summary])
    const tagsList: Array<Option> = useMemo(() => summary.tagList.map(c => ({ value: c.tag, label: c.tag })), [summary])

    const [inputData, setInputData] = useState({
        title: "",
        slug: "",
        summary: "",
        buyingPrice: "",
        sellingPrice: "",
        discount: "",
        priority: "",
        displayType: "",
        inStock: true
    })

    const payable = useMemo(() => Number(inputData.sellingPrice) - Number(inputData.discount), [inputData])
    const profit = useMemo(() => payable - Number(inputData.buyingPrice), [inputData])
    const profitPercent = useMemo(() => profit > 0 ? (((payable - Number(inputData.buyingPrice)) / Number(inputData.buyingPrice)) * 100).toFixed(2) : 0, [inputData])

    const checkSlug = () => {
        if (inputData.slug.length == 0) return;
        pb.collection(Collections.Products).getFullList({ filter: `slug = "${inputData.slug}"` }).then(res => setIsSlugUnq(res.length == 0))
    }

    const debounced = useDebounceCallback(checkSlug, 500)

    useEffect(() => {
        if (inputData.slug.length == 0) return;
        debounced()
    }, [inputData.slug])


    const handleVariantAdd = () => {
        if (!inputRef.current) return;
        const val = inputRef.current.value
        if (val.length == 0) return;
        setVariants([...variants, val])
        inputRef.current.value = ""
        inputRef.current.focus()
    }

    const handleVariantRemove = (index: number) => {
        const temp = variants.slice(index, 1)
        setVariants([...temp])
    }

    const handleSubmit = () => {
        setCreatingProducts(true);

        const {
            title,
            slug,
            buyingPrice,
            sellingPrice,
            discount,
            summary,
            priority,
            inStock,
            displayType
        } = inputData;

        const productData = {
            title,
            slug,
            buyingPrice,
            sellingPrice,
            discount,
            summary,
            priority,
            inStock,
            displayType,
            description: stateToHTML(descriptionState.getCurrentContent()),
            productVariants: [...variants],
            tags: selectedTags?.map(tag => tag.value) || [],
            categories: selectedCategory?.value,
            series: selectedSeries?.value,
            images: images.map(c => c.id)
        };

        api.post("/api/product", productData)
            .then(() => {
                notification.add({
                    status: NotificationType.SUCCESS,
                    title: "Created!",
                    message: "Product created. Please check it.."
                })
            })
            .catch(error => {
                console.error("Product upload failed:", error);
                notification.add({
                    status: NotificationType.ERROR,
                    title: "Error!",
                    message: "Product creation failed. Please try again later."
                })
            })
            .finally(() => setCreatingProducts(false))
    };

    const handleSelectImage = (img: ImagesResponse) => {
        const exists = images.findIndex(c => c.id == img.id) != -1
        if (exists) {
            setImages([...images.filter(c => c.id != img.id)])
        } else {
            setImages([...images, img])
        }
    }

    return (
        <Accordion title="Create Products">
            <div className="grid grid-cols-2 border-b border-base-content/30">
                <div className="flex flex-col gap-5 p-5 border-r border-base-content/30">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Title</legend>
                        <input
                            type="text"
                            className="input w-full"
                            placeholder="Sailor Moon Enamel Pin"
                            value={inputData.title}
                            onChange={e => setInputData({ ...inputData, title: e.target.value, slug: generateSlug(e.target.value) })}
                        />
                        <p className="label">Keep the product name brief and to the point</p>
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Slug {!isSlugUnq && <span className='text-error font-semibold'>Not available</span>}</legend>
                        <input
                            type="text"
                            className={classNames("input w-full", { "input-error": !isSlugUnq })}
                            placeholder="sailor-moon-enamel-pin"
                            value={inputData.slug}
                            onChange={e => setInputData({ ...inputData, slug: generateSlug(e.target.value) })}
                        />
                        <p className="label">Must be unique. Use only lowercase letters, numbers, and hyphens</p>
                    </fieldset>
                    <div className="grid grid-cols-2 gap-5">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Select category</legend>
                            <Select<Option>
                                className="basic-single"
                                classNamePrefix="select"
                                value={selectedCategory}
                                onChange={(option) => setSelectedCategory(option)}
                                isSearchable
                                options={categoryList}
                            />
                        </fieldset>
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Select series</legend>
                            <Select<Option>
                                className="basic-single"
                                classNamePrefix="select"
                                value={selectedSeries}
                                onChange={(option) => setSelectedSeries(option)}
                                isSearchable
                                options={seriesList}
                            />
                        </fieldset>
                        <div className='col-span-2'>
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Add tags</legend>
                                <Creatable
                                    className="basic-single"
                                    classNamePrefix="select"
                                    isMulti
                                    value={selectedTags}
                                    onChange={setSelectedTags}
                                    options={tagsList}
                                />
                            </fieldset>
                        </div>
                        <div className='col-span-2'>
                            <fieldset className="fieldset">
                                <legend className="fieldset-legend">Add Variants</legend>
                                <div className="grid grid-cols-1 gap-2 border border-base-300 p-5 rounded bg-base-200">
                                    {variants.map((v, i) => (
                                        <div className="flex gap-5" key={i}>
                                            <div className='flex items-center px-3 w-full bg-base-100 rounded border border-base-200'>{v}</div>
                                            <button className="btn btn-square" onClick={() => handleVariantRemove(i)}>
                                                <FaMinus className='size-5' />
                                            </button>
                                        </div>
                                    ))}
                                    <div className="flex gap-5">
                                        <input
                                            type="text"
                                            className="input w-full"
                                            placeholder="Black Set"
                                            ref={inputRef}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleVariantAdd();
                                                }
                                            }}
                                        />
                                        <button className="btn btn-square" onClick={handleVariantAdd}>
                                            <FaPlus className='size-5' />
                                        </button>
                                    </div>
                                </div>
                            </fieldset>
                        </div>
                        <div className='col-span-2'>
                            <div className="grid grid-cols-3 gap-5">
                                <fieldset className="fieldset relative">
                                    <legend className="fieldset-legend">Buying Price</legend>
                                    <input
                                        type="number"
                                        className="input w-full"
                                        value={inputData.buyingPrice}
                                        onChange={e => setInputData({ ...inputData, buyingPrice: e.target.value })}
                                    />
                                    <span className="badge badge-neutral badge-xs absolute top-[35%] right-5 z-[5]">TK</span>
                                </fieldset>
                                <fieldset className="fieldset relative">
                                    <legend className="fieldset-legend">Selling Price</legend>
                                    <input
                                        type="number"
                                        className="input w-full"
                                        value={inputData.sellingPrice}
                                        onChange={e => setInputData({ ...inputData, sellingPrice: e.target.value })}
                                    />
                                    <span className="badge badge-neutral badge-xs absolute top-[35%] right-5 z-[5]">TK</span>
                                </fieldset>
                                <fieldset className="fieldset relative">
                                    <legend className="fieldset-legend">Discount</legend>
                                    <input
                                        type="number"
                                        className="input w-full"
                                        value={inputData.discount}
                                        onChange={e => setInputData({ ...inputData, discount: e.target.value })}
                                    />
                                    <span className="badge badge-neutral badge-xs absolute top-[35%] right-5 z-[5]">TK</span>
                                </fieldset>
                            </div>
                            <div className="col-span-2 bg-base-200 p-5 rounded my-5">
                                <div className="flex justify-between">
                                    <div>Customer will pay {payable} TK</div>
                                    <div>Profit {profit} TK ({profitPercent}%)</div>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <div className="flex justify-between items-center">
                                    <label className="swap btn">
                                        <input type="checkbox" checked={inputData.inStock} onChange={e => setInputData({ ...inputData, inStock: e.target.checked })} />
                                        <div className="swap-on flex items-center gap-2"><FaCheckCircle className='size-5 text-success' /> In Stock</div>
                                        <div className="swap-off flex items-center gap-2"><MdError className='size-5 text-error' /> Out of Stock</div>
                                    </label>
                                    <div className="flex gap-5">
                                        <select value={inputData.displayType} className="select w-42" onChange={e => setInputData({ ...inputData, displayType: e.target.value })}>
                                            <option disabled={true} value="">Display Type</option>
                                            {constants.PRODUCT_DISPLAYS.map((e, i) => <option value={e} key={i}>{e}</option>)}
                                        </select>
                                        <select value={inputData.priority} className="select w-42" onChange={e => setInputData({ ...inputData, priority: e.target.value })}>
                                            <option disabled={true} value="">Select Priority</option>
                                            {constants.PRIORITIES.map((e, i) => <option value={e.value} key={i}>{e.label}</option>)}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="flex flex-col gap-5 p-5">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Product Summary</legend>
                        <textarea
                            className="textarea h-24 w-full"
                            placeholder=""
                            value={inputData.summary}
                            onChange={e => setInputData({ ...inputData, summary: e.target.value })}
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Product Description</legend>
                        <RichTextEditor
                            initialContent={descriptionState}
                            onChange={setDescriptionState}
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Product Images</legend>
                        <div className="grid grid-cols-5 gap-5">
                            {images.map((el, i) => (
                                <div className="h-32 w-full bg-base-200 relative group" key={i}>
                                    <img
                                        src={getImageUrl({ id: el.id, filename: el.source, wxh: "0x500" })}
                                        className='w-full h-full object-cover rounded'
                                        onClick={() => openImageModal(getImageUrl({ id: el.id, filename: el.source, wxh: "0x1500" }))}
                                    />
                                    <button className="absolute top-0 right-0 bg-red-600 text-red-100 p-2 rounded -m-1 hidden group-hover:block cursor-pointer" onClick={() => handleSelectImage(el)}>
                                        <FaTrash className='size-3' />
                                    </button>
                                </div>
                            ))}
                            <button className="h-32 w-full border border-base-content/30 border-dashed rounded flex justify-center items-center bg-base-200 cursor-pointer hover:bg-base-300" onClick={() => setIsGalleryOpen(true)}>
                                <LuImagePlus className='size-16' />
                            </button>
                        </div>
                    </fieldset>
                </div>
            </div>
            <div className="p-5 flex justify-center bg-info/30">
                <button className="btn btn-info w-64" onClick={handleSubmit}>Submit</button>
            </div>
            {creatingProducts && (
                <div className='fixed top-0 left-0 bg-base-content/80 text-base-100 w-full h-screen flex justify-center items-center'>
                    <div className="flex flex-col items-center gap-5">
                        <span className="loading loading-spinner loading-lg"></span>
                        <div>Creating Products</div>
                    </div>
                </div>
            )}
            <GallerySelect
                selectedImages={images}
                setSelectedImages={setImages}
                isGalleryOpen={isGalleryOpen}
                setIsGalleryOpen={setIsGalleryOpen}
            />
        </Accordion>
    )
}

export default ProductCreateAccordion
