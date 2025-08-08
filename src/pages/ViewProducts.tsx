import { Link, useSearchParams } from 'react-router';
import AuthLayout from '../layouts/AuthLayout';
import { useEffect, useMemo, useState } from 'react';
import { pb } from '../contexts/PocketContext';
import { Collections } from '../types/pocketbase';
import { constants } from '../constants';
import { TexpandProductListResType } from '../types/response';
import { ListResult } from 'pocketbase';
import { formatTimestamp, getImageUrl } from '../helpers';
import Accordion from '../components/Accordion';

const pageSize = 20;

function ViewProducts() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [productsData, setProductsData] = useState<ListResult<TexpandProductListResType>>();

    const pageNo = useMemo(
        () => (searchParams.get(constants.SEARCH_PARAMS.PAGIE_NO) ? Number(searchParams.get(constants.SEARCH_PARAMS.PAGIE_NO)) : 1),
        [searchParams]
    );

    useEffect(() => {
        pb.collection(Collections.Products)
            .getList(pageNo, pageSize, {
                expand: 'categories, series, images, productVariants_via_products.products',
                sort: '-created',
            })
            .then(res => setProductsData(res as unknown as ListResult<TexpandProductListResType>));
    }, [searchParams]);

    const goNext = () => {
        searchParams.set(constants.SEARCH_PARAMS.PAGIE_NO, (pageNo + 1).toString());
        setSearchParams(searchParams);
    };

    const goPrev = () => {
        searchParams.set(constants.SEARCH_PARAMS.PAGIE_NO, (pageNo - 1).toString());
        setSearchParams(searchParams);
    };

    return (
        <AuthLayout>
            <div className='container mx-auto p-5'>
                <div className='bg-base-100 border border-base-content/30'>
                    <Accordion title='Manage Products'>
                        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 p-5 bg-base-100'>
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
