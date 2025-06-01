import AuthLayout from "../layouts/AuthLayout"
import ProductCreateAccordion from "../components/ProductCreateAccordion";

function App() {
  return (
    <AuthLayout>
      <div className="container mx-auto p-5">
        <div className="bg-base-100 border border-base-content/30">

          <ProductCreateAccordion />

        </div>
      </div>
    </AuthLayout>
  )
}

export default App
