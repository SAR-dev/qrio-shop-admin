import { Link } from 'react-router'
import AuthLayout from '../layouts/AuthLayout'

function Home() {
  return (
    <AuthLayout>
      <div className="container mx-auto p-5">
        <div className="w-96 my-5 mx-auto border border-base-content/30 bg-base-100 p-5 rounded">
          <div className="text-lg font-semibold">
            What's next ?
          </div>
          <ul className="marker:text-blue-600 list-disc ps-5 space-y-2 mt-3">
            <li><Link to="/products/create">Create Products</Link></li>
            <li><Link to="/products">Manage Products</Link></li>
          </ul>
        </div>
      </div>
    </AuthLayout>
  )
}

export default Home