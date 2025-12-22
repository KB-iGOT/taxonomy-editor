import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core'
import { FrameworkService } from '../../services/framework.service'
import { Subscription } from 'rxjs'
import { ConnectorService } from '../../services/connector.service'
import { ApprovalService } from '../../services/approval.service'
import { CardChecked, CardSelection, CardsCount, Card } from '../../models/variable-type.model'
import * as _ from 'lodash'
import { UntypedFormControl, Validators } from '@angular/forms'
import { debounceTime, distinctUntilChanged } from 'rxjs/operators'

declare var LeaderLine: any
@Component({
  selector: 'lib-taxonomy-column-view',
  templateUrl: './taxonomy-column-view.component.html',
  styleUrls: ['./taxonomy-column-view.component.scss']
})
export class TaxonomyColumnViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() column: any
  @Input() containerId: string
  connectorMapping: any = {}
  @Output() updateTaxonomyTerm = new EventEmitter<CardSelection>(true);
  @Output() updateTermList = new EventEmitter<CardChecked>();
  @Output() cardsCount = new EventEmitter<CardsCount>();
  columnData: Array<Card> = [];
  childSubscription: Subscription = null;
  newTermSubscription: Subscription = null;
  approvalTerm: any
  termshafall: Array<Card> = [];
  searchValue = new UntypedFormControl('', [Validators.required]);
  startIndex = 0
  limitToAdd = 50
  currentLastIndex = 50
  columnItems = []
  filteredColumnItems = []
  // single global open-menu id for this column (used by lib-term-card)
  activeMenuCardId: string | null = null;
  constructor(
    private frameworkService: FrameworkService,
    private connectorService: ConnectorService,
    private approvalService: ApprovalService
  ) { }

  ngOnChanges(): void { }

  ngOnInit(): void {
    this.subscribeEvents()
    this.setColumnItems()

    this.searchValue.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged())
      .subscribe((ele: any) => {
        this.searchFilterData(ele)
      })

    if (this.column.index === 1) {
      this.approvalService.getUpdateList().subscribe((list: any) => {
        this.approvalTerm = list.filter(item => this.column.code === item.category)
        if (this.approvalTerm) {
          this.approvalTerm?.forEach((term) => {
            this.column.children?.forEach((lel) => {
              if (lel?.identifier === term?.identifier) {
                if (!this.isExists(term)) {
                  this.termshafall?.push(lel)
                }
              }
            })
          })
          this.column?.children?.forEach((tr) => {
            if (!this.isExists(tr)) {
              this.termshafall?.push(tr)
            }
          })
          this.columnData = this.transform(this.termshafall)
          this.setColumnItems()
          if (this.columnData && this.columnData?.length) {
            this.cardsCount.emit({ category: this.columnData[0].category, count: this.columnData.length })
          }
        }
      })
    }
    this.connectorMapping = this.connectorService.connectorMap
  }

  // receives toggle changes from child cards
  onActiveMenuChange(nextId: string | null) {
    this.activeMenuCardId = nextId
  }

  isExists(e) {
    let temp
    if (this.termshafall && this.termshafall.length) {
      temp = this.termshafall.map(t => t.identifier)
      return temp.includes(e.identifier)
    }
    return false
  }

  subscribeEvents() {
    if (this.childSubscription) {
      this.childSubscription.unsubscribe()
    }
    this.childSubscription = this.frameworkService.currentSelection.subscribe(e => {
      console.log('currentSelection event', e, this.column.code)
      if (!e) {
        return
      } else if (e.type === this.column.code) {
        const selectedTerm = { ...e.data, cardRef: e.cardRef }
        if (e.isUpdate) {
          this.updateTaxonomyTerm.emit({ isSelected: true, selectedTerm, isUpdate: true })
        } else {
          this.updateTaxonomyTerm.emit({ isSelected: true, selectedTerm })
        }
        this.columnData = this.transform((this.columnData || []).map(item => {
          item.selected = item.code === e.data.code
          return item
        }))
        this.setColumnItems()
        this.setConnectors(e.cardRef, this.columnItems, 'SINGLE')
        return
      } else {
        const next = this.frameworkService.getNextCategory(e.type)
        if (next && next.code === this.column.code) {
          setTimeout(() => {
            this.setConnectors(
              e.cardRef,
              next && next.index < this.column.index ? [] : this.columnItems,
              'ALL'
            )
          }, 100)
        }

        if (next && next.index < this.column.index) {
          this.columnData = []
          this.setColumnItems()
        }
      }
    })

    if (this.newTermSubscription) {
      this.newTermSubscription.unsubscribe()
    }
    this.newTermSubscription = this.frameworkService.insertUpdateDeleteNotifier.subscribe(e => {
      console.log('newTermSubscription ::', e)
      if (e && e.action) {
        const next = this.frameworkService.getNextCategory(e.action)
        if (next) {
          if (this.column.code === next.code && e.type === 'select') {
            this.insertUpdateHandler(e, next)
          }
          if (e.type === 'update') {
            if (this.column.code === next.code && e.type === 'update') {
              console.log('update event section')
              const selectedParent = this.frameworkService.getPreviousCategory(e.action)
              const selectedParentData = this.frameworkService.list.get(selectedParent.code)
              const selectedParentCardRef = this.frameworkService.selectionList.get(selectedParent.code) &&
                this.frameworkService.selectionList.get(selectedParent.code).cardRef
              console.log('selectedParentCardRef', selectedParentCardRef)
              if (selectedParent) {
                console.log('selectedParent', selectedParent)
                this.frameworkService.currentSelection.next({
                  type: selectedParent.code,
                  data: selectedParentData.children[0],
                  cardRef: selectedParentCardRef,
                  isUpdate: true
                })
              }
            }
          }
        }
      }
    })
  }

  insertUpdateHandler(e, next, isUpdate?) {
    console.log('insertUpdateHandler')
    const back = this.frameworkService.getPreviousCategory(this.column.code)
    const localTerms = []
    this.frameworkService.getLocalTermsByCategory(this.column.code).forEach(f => {
      const selectedParent = back ? this.frameworkService.selectionList.get(back.code) : null
      console.log('insertUpdateHandler selectedParent', selectedParent)
      if (selectedParent &&
        ((f.parent.code === selectedParent.code) ||
          (f.parent.identifier && (f.parent.identifier === selectedParent.identifier)))) {
        localTerms.push(f.term)
      }
    })
    if (!isUpdate) {
      console.log('insertUpdateHandler localTerms', localTerms)
      if (e && e.data) {
        this.columnData = this.transform([...localTerms, ...(e.data.children || [])])
          .filter(x => x.category == this.column.code)
          .map(mer => {
            this.column.children = this.column.children.map(col => { col.selected = false; return col })
            mer.selected = false
            mer.children = ([...this.column.children.filter(x => x.code === mer.code).map(a => a.children)].shift() || [])
            return mer
          })
      }
      this.setColumnItems()

      if (this.columnData.length > 0) {
        this.cardsCount.emit({ category: this.columnData[0].category, count: this.columnData.length })
      } else {
        this.cardsCount.emit({ category: this.column.code, count: 0 })
      }
    }
  }

  updateSelection1(data: any) { }

  updateSelection(selection: any) {
    console.log(selection)
  }

  setColumnItems() {
    let localSearchValue = this.searchValue.value && this.searchValue.value.toLowerCase() || ''
    let filteredColumnData = []
    this.columnItems = []
    if (localSearchValue) {
      filteredColumnData = this.columnData.filter((child: any) => {
        if (
          child.name.toLowerCase().includes(localSearchValue) ||
          (_.get(child, 'refId') && _.get(child, 'refId').toLowerCase().includes(localSearchValue)) ||
          (_.get(child, 'description') && _.get(child, 'description').toLowerCase().includes(localSearchValue)) ||
          (_.get(child, 'additionalProperties.displayName') &&
            _.get(child, 'additionalProperties.displayName').toLowerCase().includes(localSearchValue))
        ) {
          return child
        }
      })
    } else {
      filteredColumnData = this.columnData
    }
    this.filteredColumnItems = filteredColumnData
    this.columnItems = filteredColumnData ? filteredColumnData.slice(this.startIndex, this.currentLastIndex) : []
  }

  transform(value: any, sortBy = 'timeStamp'): any {
    if (!sortBy) {
      if (value) {
        return value.slice().reverse()
      }
      return null
    } else {
      if (Array.isArray(value)) {
        return value.sort((a, b) => {
          const timestampA = a.additionalProperties && a.additionalProperties.timeStamp ?
            new Date(Number(a.additionalProperties.timeStamp)).getTime() : 0
          const timestampB = b.additionalProperties && b.additionalProperties.timeStamp ?
            new Date(Number(b.additionalProperties.timeStamp)).getTime() : 0
          return timestampB - timestampA
        })
      }
    }
  }

  searchFilterData(ele: any) {
    const back = this.frameworkService.getPreviousCategory(this.column.code)
    if (back && back.code) {
      let backColumData = this.frameworkService.selectionList.get(back.code)
      if (backColumData.category) {
        this.frameworkService.removeOldLine()
        setTimeout(() => {
          this.frameworkService.currentSelection.next({
            type: backColumData.category,
            data: backColumData,
            cardRef: backColumData.cardRef
          })
        }, 200)
      }
    }
    this.setColumnItems()
  }

  clearSearch() {
    this.searchValue.setValue('')
  }

  loadMore() {
    this.currentLastIndex = this.currentLastIndex + this.limitToAdd
    this.searchFilterData(this.searchValue.value)
  }

  // === ORIGINAL CONNECTOR METHODS (restored) ===
  setConnectors(elementClicked, columnItem, mode) {
    this.removeConnectors(elementClicked, 'box' + (this.column.index - 1), this.column.index - 1)
    if (mode === 'ALL') {
      const ids = columnItem.map((c, i) => {
        return this.column.code + 'Card' + (i + 1)
      })
      this.connectorMapping['box' + (this.column.index - 1)] = {
        source: elementClicked,
        lines: (ids || []).map(id => { return { target: id, line: '', targetType: 'id' } })
      }
      this.connectorService.updateConnectorsMap(this.connectorMapping)
      const connectionLines = this.connectorService._drawLine(
        this.connectorMapping['box' + (this.column.index - 1)].source,
        this.connectorMapping['box' + (this.column.index - 1)].lines,
        null,
        '#box' + (this.column.index - 1),
        '#box' + this.column.index
      )
      this.connectorMapping['box' + (this.column.index - 1)].lines = connectionLines
    } else {
      const item = this.column.children.findIndex(c => c.selected) + 1
      if (this.column.index > 1) {
        this.connectorMapping['box' + (this.column.index - 1)].lines = [
          { target: elementClicked, line: '', targetType: 'element' }
        ]
        this.connectorService.updateConnectorsMap(this.connectorMapping)
        const connectionLines = this.connectorService._drawLine(
          this.connectorMapping['box' + (this.column.index - 1)].source,
          this.connectorMapping['box' + (this.column.index - 1)].lines,
          null,
          '#box' + (this.column.index - 1),
          '#box' + this.column.index
        )
        this.connectorMapping['box' + (this.column.index - 1)].lines = connectionLines
      }
    }
    this.connectorService.updateConnectorsMap(this.connectorMapping)
  }

  removeConnectors(currentElement, prevCol, currentIndex) {
    console.log('prevCol ------------', prevCol)
    if (this.connectorMapping) {
      for (const key in this.connectorMapping) {
        if (this.connectorMapping[key] && this.connectorMapping[key].lines && this.connectorMapping[key].lines.length > 0) {
          const lines = this.connectorMapping[key].lines
          lines.forEach(async (element, index) => {
            if (element != currentElement && prevCol == key) {
              await element.line && element.line.remove()
              lines.splice(index, 1)
            }
          })
          this.connectorMapping[key].lines = lines
        }

        let count = currentIndex + 2
        let nextCol = `box${count}`
        if (this.connectorMapping[nextCol] && this.connectorMapping[nextCol].lines && this.connectorMapping[nextCol].lines.length > 0) {
          const lines = this.connectorMapping[nextCol].lines
          lines.forEach(async (element, index) => {
            await element.line && element.line.remove()
            lines.splice(index, 1)
          })
          this.connectorMapping[nextCol].lines = null
        }
      }
    }
  }

  selectedCard(event) {
    this.updateTermList.emit(event)
  }

  get showLoadMoreBtn(): boolean {
    if (this.column && this.column.config && this.column.config.categoryDisplayName !== 'Organisation'
      && this.column.name !== 'Organisation' && this.columnItems && this.columnItems.length > 0) {
      return true
    }
    return false
  }

  get disableLoadButton(): boolean {
    if (this.filteredColumnItems && this.filteredColumnItems.length < this.currentLastIndex) {
      return true
    }
    return false
  }

  ngOnDestroy(): void {
    if (this.childSubscription) {
      this.childSubscription.unsubscribe()
    }
    if (this.newTermSubscription) {
      this.newTermSubscription.unsubscribe()
    }
  }
}
