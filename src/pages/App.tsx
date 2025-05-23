import { FaPlus } from "react-icons/fa"
import AuthLayout from "../layouts/AuthLayout"
import Select, { MultiValue } from 'react-select';
import { useDataStore } from "../stores/dataStore"
import { useMemo, useState } from "react"
import Creatable from "react-select/creatable";

interface Option {
  value: string;
  label: string;
}

function App() {
  const { summary } = useDataStore()

  const [selectedCategory, setSelectedCategory] = useState<Option | null>(null);
  const [selectedSeries, setSelectedSeries] = useState<Option | null>(null);
  const [selectedTags, setSelectedTags] = useState<MultiValue<Option> | null>(null);

  const categoryList: Array<Option> = useMemo(() => summary.categoryList.map(c => ({ value: c.id, label: c.title })), [summary])
  const seriesList: Array<Option> = useMemo(() => summary.seriesList.map(c => ({ value: c.id, label: c.title })), [summary])
  const tagsList: Array<Option> = useMemo(() => summary.tagList.map(c => ({ value: c.tag, label: c.tag })), [summary])

  return (
    <AuthLayout>
      <div className="container mx-auto p-5">
        <div className="bg-base-100 border border-base-300">

          <div className="w-full flex flex-col">
            <div className="flex justify-between items-center p-5 bg-accent/30">
              <h3 className="text-xl font-semibold">Create Products</h3>
              <button className="btn btn-square btn-accent btn-sm">
                <FaPlus className="size-4" />
              </button>
            </div>
            <div>
              <div className="flex flex-col gap-5 p-5">
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Title</legend>
                  <input type="text" className="input w-full" placeholder="Sailor Moon Enamel Pin" />
                  <p className="label">Keep the product name brief and to the point</p>
                </fieldset>
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Slug</legend>
                  <input type="text" className="input w-full" placeholder="sailor-moon-enamel-pin" />
                  <p className="label">Use only lowercase letters, numbers, and hyphens</p>
                </fieldset>
                <div className="grid grid-cols-3 gap-5">
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
            </div>
          </div>

        </div>
      </div>
    </AuthLayout>
  )
}

export default App
