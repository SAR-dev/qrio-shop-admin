import { create } from 'zustand'
import { SummaryResType } from '../types/response'

type State = {
    summary: SummaryResType
    setSummary: (props: SummaryResType) => void
}

export const useDataStore = create<State>((set) => ({
    summary: {
        seriesList: [],
        categoryList: [],
        tagList: []
    },
    setSummary: (value: SummaryResType) =>
        set(() => ({ summary: value })),
}))