import { Link, useSearchParams } from 'react-router';
import AuthLayout from '../layouts/AuthLayout';
import { useEffect, useMemo, useState } from 'react';
import { pb } from '../contexts/PocketContext';
import { Collections } from '../types/pocketbase';
import { constants } from '../constants';
import { Option, TexpandProductListResType } from '../types/response';
import { ListResult } from 'pocketbase';
import { formatTimestamp, getImageUrl } from '../helpers';
import Accordion from '../components/Accordion';
import { useDataStore } from '../stores/dataStore';
import Select, { MultiValue } from 'react-select';

const pageSize = 20;
const escapePB = (str: string) => str.replace(/"/g, '\\"');

function ViewProducts() {
    const { summary } = useDataStore();
    const [productsData, setProductsData] = useState<ListResult<TexpandProductListResType>>();

    const [pageNo, setPageNo] = useState(1);
    const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
    const [selectedSeries, setSelectedSeries] = useState<Option | null>(null);
    const [searchText, setSearchText] = useState('');

    const categoryList: Array<Option> = useMemo(
        () => [{ value: '', label: 'None' }, ...summary.categoryList.map(c => ({ value: c.id, label: c.title }))],
        [summary]
    );
    const seriesList: Array<Option> = useMemo(
        () => [{ value: '', label: 'None' }, ...summary.seriesList.map(c => ({ value: c.id, label: c.title }))],
        [summary]
    );

    useEffect(() => {
        const filters: string[] = [];
    
        if (selectedCategory?.value) {
            filters.push(`categories = "${escapePB(selectedCategory.value)}"`);
        }
    
        if (selectedSeries?.value) {
            filters.push(`series = "${escapePB(selectedSeries.value)}"`);
        }
    
        if (searchText.length >= 3) {
            filters.push(`title ~ "%${escapePB(searchText)}%"`);
        }
    
        const filter = filters.length ? filters.join(' && ') : '';
    
        pb.collection(Collections.Products)
            .getList(pageNo, pageSize, {
                expand: 'categories,series,images,productVariants_via_products.products',
                sort: '-created',
                filter,
            })
            .then((res) => {
                setProductsData(res as unknown as ListResult<TexpandProductListResType>);
            })
            .catch((err) => {
                console.error('Failed to fetch products:', err);
            });
    
    }, [pageNo, pageSize, selectedCategory, selectedSeries, searchText]);

    const goNext = () => {
        setPageNo(pageNo + 1);
    };

    const goPrev = () => {
        setPageNo(pageNo - 1);
    };

    return (
        <AuthLayout>
            <div className='container mx-auto p-5'>
                <div className='bg-base-100 border border-base-content/30'>
                    <Accordion title='Manage Products'>
                        <div className='grid grid-cols-3 gap-5 p-5 bg-base-100'>
                            <div className='col-span-3'>
                                <div className='grid grid-cols-3 gap-5 w-full'>
                                    <fieldset className='fieldset'>
                                        <legend className='fieldset-legend'>Select category</legend>
                                        <Select<Option>
                                            className='basic-single'
                                            classNamePrefix='select'
                                            value={selectedCategory}
                                            onChange={option => setSelectedCategory(option)}
                                            isSearchable
                                            options={categoryList}
                                        />
                                    </fieldset>
                                    <fieldset className='fieldset'>
                                        <legend className='fieldset-legend'>Select series</legend>
                                        <Select<Option>
                                            className='basic-single'
                                            classNamePrefix='select'
                                            value={selectedSeries}
                                            onChange={option => setSelectedSeries(option)}
                                            isSearchable
                                            options={seriesList}
                                        />
                                    </fieldset>
                                    <fieldset className='fieldset'>
                                        <legend className='fieldset-legend'>Search title (Min 3 charcters)</legend>
                                        <input
                                            type='text'
                                            className='input w-full'
                                            placeholder='Search...'
                                            value={searchText}
                                            onChange={e => setSearchText(e.target.value)}
                                        />
                                    </fieldset>
                                </div>
                            </div>
                            {productsData?.items.map((e, i) => (
                                <div key={i} className='border border-base-content/30 rounded-lg p-4 flex flex-col justify-between'>
                                    <div className='mb-3'>
                                        <div className='flex justify-between items-center'>
                                            {/* Series Title */}
                                            <div className='text-xs font-semibold text-primary uppercase tracking-wide mb-1'>
                                                Series: {e.expand.series?.title}
                                            </div>
                                            {/* Stock Status & Created Time */}
                                            <div className='flex justify-between items-center text-sm'>
                                                {e.inStock ? (
                                                    <span className='text-info bg-info/10 px-2 py-1 rounded'>In Stock</span>
                                                ) : (
                                                    <span className='text-error bg-error/10 px-2 py-1 rounded'>Out of Stock</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Product Title and Slug */}
                                        <h2 className='font-bold text-lg'>{e.title}</h2>
                                        <p className='text-xs text-base-content/60'>
                                            {e.slug} ({e.id})
                                        </p>

                                        {/* Product Image */}
                                        <div className='w-full h-48 my-4'>
                                            {e.expand.images && e.expand.images.length > 0 && (
                                                <img
                                                    src={getImageUrl({
                                                        id: e.expand.images[0].id,
                                                        filename: e.expand.images[0].source,
                                                        wxh: '0x500',
                                                    })}
                                                    className='w-full h-full object-cover rounded'
                                                />
                                            )}
                                        </div>

                                        {/* Prices in single line */}
                                        <div className='flex justify-between text-sm text-base-content/80 mb-4'>
                                            <div>Cost: TK {e.buyingPrice}</div>
                                            <div>Selling: TK {e.sellingPrice}</div>
                                            <div>Discount: TK {e.discount ?? 0}</div>
                                        </div>

                                        {/* Category & Priority */}
                                        <div className='mb-2 flex flex-wrap gap-2 text-xs'>
                                            <span className='bg-base-300 px-2 py-1 rounded'>Category: {e.expand.categories?.title}</span>
                                            <span className='bg-base-300 px-2 py-1 rounded'>
                                                Variants: {e.expand.productVariants_via_products?.length ?? 0}
                                            </span>
                                            <span className='bg-base-300 px-2 py-1 rounded'>
                                                Priority: {constants.PRIORITIES.find(c => c.value == e.priority)?.value}
                                            </span>
                                        </div>

                                        {/* Edit Button */}
                                        <div className='mt-4 flex justify-between items-center'>
                                            <div className='text-xs'>Created: {formatTimestamp(e.created)}</div>
                                            <Link to={`/products/${e.id}`} className='btn btn-xs btn-info'>
                                                Edit
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='grid grid-cols-3 p-5 bg-info/30'>
                            <div className='flex items-center'>Total found {productsData?.totalItems} items</div>
                            <div className='justify-center flex items-center'>Showing {productsData?.items.length} items</div>
                            <div className='join ml-auto'>
                                <button className='join-item btn' disabled={pageNo == 1} onClick={goPrev}>
                                    «
                                </button>
                                <button className='join-item btn'>Page {pageNo}</button>
                                <button className='join-item btn' disabled={pageNo == productsData?.totalPages} onClick={goNext}>
                                    »
                                </button>
                            </div>
                        </div>
                    </Accordion>
                </div>
            </div>
        </AuthLayout>
    );
}

export default ViewProducts;
