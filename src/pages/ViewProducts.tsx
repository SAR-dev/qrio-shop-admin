import { Link, useSearchParams } from 'react-router';
import AuthLayout from '../layouts/AuthLayout';
import { useEffect, useState } from 'react';
import { pb } from '../contexts/PocketContext';
import { Collections } from '../types/pocketbase';
import { constants } from '../constants';
import { TexpandProductListResType } from '../types/response';
import { ListResult } from 'pocketbase';
import { formatTimestamp, getImageUrl } from '../helpers';
import Accordion from '../components/Accordion';
import { useDataStore } from '../stores/dataStore';

const pageSize = 20;
const escapePB = (str: string) => str.replace(/"/g, '\\"');

function ViewProducts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { summary } = useDataStore();
    const [isLoading, setIsLoading] = useState(false);
    const [productsData, setProductsData] = useState<ListResult<TexpandProductListResType>>();
    const [searchText, setSearchText] = useState(searchParams.get(constants.FILTERS.SEARCH) ?? "");

    useEffect(() => {
        setIsLoading(true);
        const filters: string[] = [];

        const seriesId = summary?.seriesList.find(e => e.id == searchParams.get(constants.FILTERS.SERIES_ID))?.id ?? ""
        const categoryId = summary?.categoryList.find(e => e.id == searchParams.get(constants.FILTERS.CATEGORY_ID))?.id ?? ""
        const pageNo = Number(searchParams.get(constants.FILTERS.PAGE_NO) ?? 1);
        const search = searchParams.get(constants.FILTERS.SEARCH) ?? ""

        if (categoryId.length > 0) {
            filters.push(`categories = "${escapePB(categoryId)}"`);
        }

        if (seriesId.length > 0) {
            filters.push(`series = "${escapePB(seriesId)}"`);
        }

        if (search.length >= 3) {
            filters.push(`title ~ "%${escapePB(search)}%"`);
        }

        const filter = filters.length ? filters.join(' && ') : '';

        pb.collection(Collections.Products)
            .getList(pageNo, pageSize, {
                expand: 'categories,series,images,productVariants_via_products.products',
                sort: '-created',
                filter,
            })
            .then(res => {
                setProductsData(res as unknown as ListResult<TexpandProductListResType>);
            })
            .catch(err => {
                console.error('Failed to fetch products:', err);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [summary, searchParams]);

    const goNext = () => {
        setSearchParams({
            seriesId: searchParams.get(constants.FILTERS.SERIES_ID) ?? '',
            categoryId: searchParams.get(constants.FILTERS.CATEGORY_ID) ?? '',
            search: searchParams.get(constants.FILTERS.SEARCH) ?? '',
            pageSize: pageSize.toString(),
            pageNo: (Number(searchParams.get(constants.FILTERS.PAGE_NO) ?? 1) + 1).toString(),
        });
    };

    const goPrev = () => {
        setSearchParams({
            seriesId: searchParams.get(constants.FILTERS.SERIES_ID) ?? '',
            categoryId: searchParams.get(constants.FILTERS.CATEGORY_ID) ?? '',
            search: searchParams.get(constants.FILTERS.SEARCH) ?? '',
            pageSize: pageSize.toString(),
            pageNo: (Number(searchParams.get(constants.FILTERS.PAGE_NO) ?? 2) - 1).toString(),
        });
    };

    return (
        <AuthLayout>
            <div className='container mx-auto p-5'>
                <div className='bg-base-100 border border-base-content/30'>
                    <Accordion title='Manage Products'>
                        <div className='grid grid-cols-3 gap-5 p-5 bg-base-100'>
                            <div className='col-span-3'>
                                <div className='grid grid-cols-3 gap-5 w-full'>
                                    <label className='form-control w-full max-w-xs'>
                                        <div className='label'>
                                            <span className='label-text'>Category</span>
                                        </div>
                                        <select
                                            disabled={isLoading}
                                            value={searchParams.get(constants.FILTERS.CATEGORY_ID) ?? ''}
                                            className='select select-bordered'
                                            onChange={e =>
                                                setSearchParams({
                                                    seriesId: searchParams.get(constants.FILTERS.SERIES_ID) ?? '',
                                                    categoryId: e.target.value,
                                                    search: searchParams.get(constants.FILTERS.SEARCH) ?? '',
                                                })
                                            }
                                        >
                                            <option selected value=''>
                                                All
                                            </option>
                                            {summary.categoryList.map((e, i) => (
                                                <option value={e.id} key={i}>
                                                    {e.title}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className='form-control w-full max-w-xs'>
                                        <div className='label'>
                                            <span className='label-text'>Series</span>
                                        </div>
                                        <select
                                            disabled={isLoading}
                                            value={searchParams.get(constants.FILTERS.SERIES_ID) ?? ''}
                                            onChange={e =>
                                                setSearchParams({
                                                    seriesId: e.target.value,
                                                    categoryId: searchParams.get(constants.FILTERS.CATEGORY_ID) ?? '',
                                                    search: searchParams.get(constants.FILTERS.SEARCH) ?? '',
                                                })
                                            }
                                            className='select select-bordered'
                                        >
                                            <option selected value=''>
                                                All
                                            </option>
                                            {summary.seriesList.map((e, i) => (
                                                <option value={e.id} key={i}>
                                                    {e.title}
                                                </option>
                                            ))}
                                        </select>
                                    </label>
                                    <label className='form-control w-full col-span-2 md:col-span-1'>
                                        <div className='label'>
                                            <span className='label-text'>Search Text</span>
                                            <span className='label-text-alt'>Press 'Enter' to search</span>
                                        </div>
                                        <input
                                            type='text'
                                            disabled={isLoading}
                                            value={searchText}
                                            onChange={e => setSearchText(e.target.value)}
                                            onKeyDown={e => {
                                                if (e.key === 'Enter') {
                                                    setSearchParams({
                                                        seriesId: searchParams.get(constants.FILTERS.SERIES_ID) ?? '',
                                                        categoryId: searchParams.get(constants.FILTERS.CATEGORY_ID) ?? '',
                                                        search: searchText,
                                                    });
                                                }
                                            }}
                                            className='input input-bordered'
                                        />
                                    </label>
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
                                <button className='join-item btn' disabled={Number(searchParams.get(constants.FILTERS.PAGE_NO)) == 1} onClick={goPrev}>
                                    «
                                </button>
                                <button className='join-item btn'>Page {Number(searchParams.get(constants.FILTERS.PAGE_NO))}</button>
                                <button className='join-item btn' disabled={Number(searchParams.get(constants.FILTERS.PAGE_NO)) == productsData?.totalPages} onClick={goNext}>
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
