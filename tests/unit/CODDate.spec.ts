import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuelidate from 'vuelidate'
import { mount, Wrapper } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { useBusinessStore, useFilingHistoryListStore, useRootStore } from '@/stores'
import CodDate from '@/components/StandaloneDirectorChange/CODDate.vue'
import { CorpTypeCd } from '@bcrs-shared-components/corp-type-module'

// suppress "Avoid mutating a prop directly" warnings
// ref: https://github.com/vuejs/vue-test-utils/issues/532
Vue.config.silent = true

Vue.use(Vuetify)
Vue.use(Vuelidate)

const vuetify = new Vuetify({})
setActivePinia(createPinia())
const businessStore = useBusinessStore()
const filingHistoryListStore = useFilingHistoryListStore()
const rootStore = useRootStore()

describe('COD Date - COOPs', () => {
  let wrapper: Wrapper<CodDate>
  let vm: any

  beforeEach(() => {
    // init store
    rootStore.currentDate = '2019-07-15'
    businessStore.setFoundingDate('2018-03-01T12:00:00')
    businessStore.setLegalType(CorpTypeCd.COOP)

    wrapper = mount(CodDate, { vuetify })
    vm = wrapper.vm
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('loads variables properly when initial COD Date is set', async () => {
    await wrapper.setProps({ initialCodDate: '2019-05-10' })

    // verify local variables
    expect(vm.$data.date).toBe('2019-05-10')
    expect(vm.$data.dateFormatted).toBe('2019/05/10')

    // verify emitted COD Date
    const codDates = wrapper.emitted('codDate')
    expect(codDates.length).toBe(1)
    expect(codDates[0]).toEqual(['2019-05-10'])

    // verify emitted Valid
    const valids = wrapper.emitted('valid')
    expect(valids.length).toBe(1)
    expect(valids[0]).toEqual([true])
  })

  it('sets Min Date properly based on global properties', () => {
    // verify default Min Date
    expect(vm.minDate).toBe('2018-03-01')

    // set Last COD Filing Date and verify new Min Date
    businessStore.setLastDirectorChangeDate('2019-03-01')

    expect(vm.minDate).toBe('2019-03-01')

    // cleanup
    filingHistoryListStore.setFilings([])
  })

  it('sets Min Date to entity founding date if no filings are present', () => {
    businessStore.setLastDirectorChangeDate(null)
    expect(vm.minDate).toBe('2018-03-01')
  })

  it('sets Max Date to current date in store', () => {
    expect(vm.maxDate).toBe(rootStore.currentDate)
  })

  it('Shows error message when date has invalid length', async () => {
    await wrapper.setData({ dateFormatted: '2019/11/6' })

    expect(vm.$data.date).toBe('')
    expect(vm.$el.querySelector('.v-messages').textContent).toContain('A Director change date is required.')
  })

  it('sets date picker and emits date changed and valid events when date is changed', async () => {
    await wrapper.setData({ dateFormatted: '2019/05/10' })

    // verify local variables
    expect(vm.$data.date).toBe('2019-05-10')

    await wrapper.setData({ dateFormatted: '2019/05/11' })

    // verify local variables
    expect(vm.$data.date).toBe('2019-05-11')

    // verify emitted COD Dates
    // first emit is from init
    // second emit is from text field update
    const codDates = wrapper.emitted('codDate')
    expect(codDates.length).toBe(2)
    expect(codDates[0]).toEqual(['2019-05-10'])
    expect(codDates[1]).toEqual(['2019-05-11'])

    // verify emitted Valids
    // first emit is from init
    // second emit is from text field update
    const valids = wrapper.emitted('valid')
    expect(valids.length).toBe(2)
    expect(valids[0]).toEqual([true])
    expect(valids[1]).toEqual([true])
  })

  it('invalidates the component when entered date is after Max Date', async () => {
    wrapper = mount(CodDate, {
      vuetify,
      computed: {
        minDate: () => '2019-05-05',
        maxDate: () => '2019-05-10',
        codDateRules: () => []
      }
    })

    // force all dates to appear valid
    jest.spyOn((wrapper.vm as any), 'isValidDate').mockImplementation(() => true)

    // verify initial validators and error message
    expect(wrapper.vm.$v.dateFormatted.isNotNull).toBe(false)
    expect(wrapper.vm.$v.dateFormatted.isValidFormat).toBe(false)
    expect(wrapper.vm.$v.dateFormatted.isValidCodDate).toBe(false)
    expect(wrapper.find('.validationErrorInfo').exists()).toBe(false)

    // set a date after Max Date
    await wrapper.setData({ date: '2019-05-11' })

    // verify validators and error message
    expect(wrapper.vm.$v.dateFormatted.isNotNull).toBe(true)
    expect(wrapper.vm.$v.dateFormatted.isValidFormat).toBe(true)
    expect(wrapper.vm.$v.dateFormatted.isValidCodDate).toBe(false)
    expect(wrapper.find('.validationErrorInfo > span').text())
      .toContain('Please enter a day between 2019/05/05 and 2019/05/10.')
  })

  it('invalidates the component when entered date is before Min Date', async () => {
    wrapper = mount(CodDate, {
      vuetify,
      computed: {
        minDate: () => '2019-05-05',
        maxDate: () => '2019-05-10'
      }
    })

    // force all dates to appear valid
    jest.spyOn((wrapper.vm as any), 'isValidDate').mockImplementation(() => true)

    // verify initial validators and error message
    expect(wrapper.vm.$v.dateFormatted.isNotNull).toBe(false)
    expect(wrapper.vm.$v.dateFormatted.isValidFormat).toBe(false)
    expect(wrapper.vm.$v.dateFormatted.isValidCodDate).toBe(false)
    expect(wrapper.find('.validationErrorInfo').exists()).toBe(false)

    // set a date before Min Date
    await wrapper.setData({ date: '2019-05-04' })

    // verify validators and error message
    expect(wrapper.vm.$v.dateFormatted.isNotNull).toBe(true)
    expect(wrapper.vm.$v.dateFormatted.isValidFormat).toBe(true)
    expect(wrapper.vm.$v.dateFormatted.isValidCodDate).toBe(false)
    expect(wrapper.find('.validationErrorInfo > span').text())
      .toContain('Please enter a day between 2019/05/05 and 2019/05/10.')
  })
})

describe('COD Date - BCOMPs', () => {
  let wrapper: Wrapper<CodDate>
  let vm: any

  beforeEach(() => {
    // init store
    rootStore.currentDate = '2019-07-15'
    businessStore.setFoundingDate('2018-03-01T12:00:00')
    businessStore.setLegalType(CorpTypeCd.BENEFIT_COMPANY)

    wrapper = mount(CodDate, { vuetify })
    vm = wrapper.vm
  })

  afterEach(() => {
    wrapper.destroy()
  })

  it('sets BCOMP Min Date to the last COD date if COD filings exist', () => {
    // set Last COD Filing Date and verify new Min Date
    businessStore.setLastDirectorChangeDate('2019-03-01')
    expect(vm.minDate).toBe('2019-03-01')

    // cleanup
    filingHistoryListStore.setFilings([])
  })

  it('sets BCOMP Min Date to entity founding date if no filings are present', () => {
    businessStore.setLastDirectorChangeDate(null)
    expect(vm.minDate).toBe('2018-03-01')
  })
})
