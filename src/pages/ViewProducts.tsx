import { Link, useSearchParams } from 'react-router';
import AuthLayout from '../layouts/AuthLayout'
import { useEffect, useMemo, useState } from 'react';
import { pb } from '../contexts/PocketContext';
import { Collections } from '../types/pocketbase';
import { constants } from '../constants';
import { TexpandProductListResType } from '../types/response';
import { ListResult } from 'pocketbase';
import { formatTimestamp } from '../helpers';
import Accordion from '../components/Accordion';

const pageSize = 20

function ViewProducts() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [productsData, setProductsData] = useState<ListResult<TexpandProductListResType>>()

  const pageNo = useMemo(() => searchParams.get(constants.SEARCH_PARAMS.PAGIE_NO) ? Number(searchParams.get(constants.SEARCH_PARAMS.PAGIE_NO)) : 1, [searchParams])

  useEffect(() => {
    pb.collection(Collections.Products)
      .getList(pageNo, pageSize, {
        expand: "categories, series, images, productVariants_via_products.products",
        sort: "-created"
      })
      .then(res => setProductsData(res as unknown as ListResult<TexpandProductListResType>))
  }, [searchParams])

  const goNext = () => {
    searchParams.set(constants.SEARCH_PARAMS.PAGIE_NO, (pageNo + 1).toString())
    setSearchParams(searchParams)
  }

  const goPrev = () => {
    searchParams.set(constants.SEARCH_PARAMS.PAGIE_NO, (pageNo - 1).toString())
    setSearchParams(searchParams)
  }

  return (
    <AuthLayout>
      <div className="container mx-auto p-5">
        <div className="bg-base-100 border border-base-content/30">
          <Accordion title="Manage Products">
            <div className="overflow-auto h-[80vh] bg-base-100 border border-base-300">
              <table className="table table-pin-rows">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Title</th>
                    <th>Slug</th>
                    <th>Display Type</th>
                    <th>Variants</th>
                    <th>Cost Price</th>
                    <th>Selling Price</th>
                    <th>Discount</th>
                    <th className='text-center'>Category</th>
                    <th className='text-center'>Series</th>
                    <th>Priority</th>
                    <th>In Stock</th>
                    <th>Created At</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {productsData?.items.map((e, i) => (
                    <tr key={i}>
                      <th>
                        <div className='font-medium text-xs bg-base-300 text-center rounded-lg border border-base-content/30 py-1 px-2'>{e.id}</div>
                      </th>
                      <td className='min-w-96'>{e.title}</td>
                      <td className='min-w-64'>{e.slug}</td>
                      <td>
                        <div className="bg-base-100 py-1 text-center border border-base-300 rounded-xl px-3">{e.displayType.length > 0 ? e.displayType : "N/A"}</div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1">
                          {(e.expand.productVariants_via_products || []).map((v) => (
                            <div className='text-xs px-2 py-1 border border-base-content/10 text-center rounded-lg leading-3 w-fit mx-auto' key={v.id}>{v.title}</div>
                          ))}
                        </div>
                      </td>
                      <td>TK {e.buyingPrice}</td>
                      <td>TK {e.sellingPrice}</td>
                      <td>TK {e.discount ?? 0}</td>
                      <td className='min-w-48'>
                        <div className="bg-base-content/10 py-1 text-center border border-base-300 rounded-xl px-3 w-fit mx-auto">{e.expand.categories.title}</div>
                      </td>
                      <td className='min-w-64'>
                        <div className="bg-base-content/10 py-1 text-center border border-base-300 rounded-xl px-3 w-fit mx-auto">{e.expand.series.title}</div>
                      </td>
                      <td>{constants.PRIORITIES.find(c => c.value == e.priority)?.value}</td>
                      <td>
                        {e.inStock ? <div className='text-success bg-success/10 w-20 text-center py-1 rounded-lg'>In Stock</div> : <div className='text-error bg-error/10 w-20 text-center py-1 rounded-lg'>Out of Stock</div>}
                      </td>
                      <td className='text-xs min-w-32'>{formatTimestamp(e.created)}</td>
                      <td>
                        <div className="flex gap-3">
                          <Link to={`/products/${e.id}`} className='btn btn-sm'>Edit</Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <th></th>
                  </tr>
                </tfoot>
              </table>
            </div>
            <div className="grid grid-cols-3 p-5 bg-info/30">
              <div className='flex items-center'>Total found {productsData?.totalItems} items</div>
              <div className='justify-center flex items-center'>Showing {productsData?.items.length} items</div>
              <div className="join ml-auto">
                <button className="join-item btn" disabled={pageNo == 1} onClick={goPrev}>«</button>
                <button className="join-item btn">Page {pageNo}</button>
                <button className="join-item btn" disabled={pageNo == productsData?.totalPages} onClick={goNext}>»</button>
              </div>
            </div>
          </Accordion>
        </div>
      </div>
    </AuthLayout>
  )
}

export default ViewProducts