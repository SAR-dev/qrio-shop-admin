import Select, { MultiValue } from 'react-select';
import { useDataStore } from "../stores/dataStore"
import { useMemo, useState } from "react"
import Creatable from "react-select/creatable";
import Accordion from "./Accordion";
import { generateSlug } from '../helpers';
import RichTextEditor from './RichTextEditor';
import ImageEditor from './ImageEditor';
import ImageGallery from './ImageGallery';

interface Option {
    value: string;
    label: string;
}

function ProductCreateAccordion() {
    const { summary } = useDataStore()

    const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
    const [selectedSeries, setSelectedSeries] = useState<Option | null>(null);
    const [selectedTags, setSelectedTags] = useState<MultiValue<Option> | null>(null);

    const categoryList: Array<Option> = useMemo(() => summary.categoryList.map(c => ({ value: c.id, label: c.title })), [summary])
    const seriesList: Array<Option> = useMemo(() => summary.seriesList.map(c => ({ value: c.id, label: c.title })), [summary])
    const tagsList: Array<Option> = useMemo(() => summary.tagList.map(c => ({ value: c.tag, label: c.tag })), [summary])

    const [inputData, setInputData] = useState({
        title: "",
        slug: "",
        summary: "",
        description: ""
    })

    return (
        <Accordion title="Create Products" defaultIsOpen>
            <div className="grid grid-cols-2 divide-x divide-base-300">
                <div className="flex flex-col gap-5 p-5">
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
                        <legend className="fieldset-legend">Slug</legend>
                        <input
                            type="text"
                            className="input w-full"
                            placeholder="sailor-moon-enamel-pin"
                            value={inputData.slug}
                            onChange={e => setInputData({ ...inputData, slug: generateSlug(e.target.value) })}
                        />
                        <p className="label">Use only lowercase letters, numbers, and hyphens</p>
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
                    </div>
                    <div className="col-span-2">
                        <fieldset className="fieldset">
                            <legend className="fieldset-legend">Product Summary</legend>
                            <textarea
                                className="textarea h-24 w-full"
                                placeholder=""
                                value={inputData.summary}
                                onChange={e => setInputData({ ...inputData, summary: e.target.value })}
                            />
                        </fieldset>
                    </div>
                </div>
                <div className="flex flex-col gap-5 p-5">
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Product Description</legend>
                        <RichTextEditor
                            initialContent={inputData.description}
                            onChange={c => setInputData({ ...inputData, description: c })}
                        />
                    </fieldset>
                    <fieldset className="fieldset">
                        <legend className="fieldset-legend">Product Images</legend>
                        <ImageGallery />
                    </fieldset>
                </div>
                <div className="col-span-2">
                    {/* <ImageEditor /> */}
                </div>
            </div>
        </Accordion>
    )
}

export default ProductCreateAccordion
