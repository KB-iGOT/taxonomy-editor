import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FrameworkService } from '../../services/framework.service';
import { Subscription } from 'rxjs';
import { ConnectorService } from '../../services/connector.service';
import { ApprovalService } from '../../services/approval.service';
import { CardChecked, CardSelection, CardsCount, Card } from '../../models/variable-type.model';
import * as _ from 'lodash'
import { UntypedFormControl, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

declare var LeaderLine: any;
@Component({
  selector: 'lib-taxonomy-column-view',
  templateUrl: './taxonomy-column-view.component.html',
  styleUrls: ['./taxonomy-column-view.component.scss']
})
export class TaxonomyColumnViewComponent implements OnInit, OnDestroy, OnChanges {
  @Input() column: any;
  @Input() containerId: string
  connectorMapping: any = {}
  @Output() updateTaxonomyTerm = new EventEmitter<CardSelection>(true);
  @Output() updateTermList = new EventEmitter<CardChecked>();
  @Output() cardsCount = new EventEmitter<CardsCount>();
  columnData: Array<Card> = [];
  childSubscription: Subscription = null;
  newTermSubscription: Subscription = null;
  approvalTerm: any;
  termshafall: Array<Card> = [];
  searchValue = new UntypedFormControl('', [Validators.required]);
  startIndex = 0
  limitToAdd = 50
  currentLastIndex = 50
  constructor(
    private frameworkService: FrameworkService,
    private connectorService: ConnectorService,
    private approvalService : ApprovalService
  ) {
  }
  ngOnChanges(changes: SimpleChanges): void {}


  ngOnInit(): void {
    this.subscribeEvents()
    this.searchValue.valueChanges.pipe(
      debounceTime(700),
      distinctUntilChanged(),
    ).subscribe((ele: any) => {
      this.searchFilterData(ele)
    })

    if (this.column.index === 1) {
      this.approvalService.getUpdateList().subscribe((list:any) => {
        this.approvalTerm = list.filter(item => this.column.code === item.category)
        if(this.approvalTerm){
          this.approvalTerm.forEach((term, i)=> {
             this.column.children.forEach((lel,j) => {
                if(lel.identifier === term.identifier){
                  if(!this.isExists(term)){
                    this.termshafall.push(lel)
                  }
                }
             })
          })
          // this.termshafall = [...this.termshafall]
          this.column.children.forEach((tr, i) => {
            if(!this.isExists(tr)){
              this.termshafall.push(tr)
            }
          })
          this.columnData = this.termshafall;
          if(this.columnData && this.columnData.length) {
            this.cardsCount.emit({category: this.columnData[0].category,count:this.columnData.length});
          }
        }
      })
    }
    this.connectorMapping = this.connectorService.connectorMap
    // this.frameworkService.isDataUpdated.subscribe(() => {
    //   this.ngOnInit()
    // })
    
  }
 
  isExists(e){
    let temp;
    if(this.termshafall && this.termshafall.length) {
      temp = this.termshafall.map(t => t.identifier)
      return temp.includes(e.identifier)
    } return false
  }
  
  subscribeEvents() {
    if (this.childSubscription) {
      this.childSubscription.unsubscribe()
    }
    this.childSubscription = this.frameworkService.currentSelection.subscribe(e => {
       console.log('currentSelection event', e, this.column.code )
      if (!e) {
        return
      } else if (e.type === this.column.code) {
        const selectedTerm = {...e.data, cardRef: e.cardRef }
        if(e.isUpdate){
          this.updateTaxonomyTerm.emit({ isSelected: true, selectedTerm, isUpdate: true })
        } else {
          this.updateTaxonomyTerm.emit({ isSelected: true, selectedTerm })
        }
        this.columnData = (this.columnData || []).map(item => {
          if (item.code === e.data.code) {
            item.selected = true
          } else {
            item.selected = false
          }
          return item
        });
        this.setConnectors(e.cardRef, this.columnData, 'SINGLE')
        return
      } else {
        const next = this.frameworkService.getNextCategory(e.type);
        // // console.log("ADD: from subscription===>", "FOR " + this.category, next, this.children)
        if (next && next.code === this.column.code) {
          //   const back = this.frameworkService.getPreviousCategory(this.column.code)
          //   console.log('current Saved ===========>', this.frameworkService.getLocalTermsByCategory(this.column.code))
          //   const localTerms = []
          //   this.frameworkService.getLocalTermsByCategory(this.column.code).forEach(f => {
          // debugger
          //     const lst = back ? this.frameworkService.selectionList.get(back.code) : null; //can use current
          //     if (lst && f.parent.identifier === lst.identifier) {
          //       localTerms.push(f.term)
          //     }
          //   })
          //   // get last parent and filter Above

          //   this.columnData = [...localTerms, ...(e.data.children || [])]
          //     .filter(x => {
          //       return x.category == this.column.code
          //     }).map(mer => {
          //       //**read local children for next */
          //       // const nextChildren = this.frameworkService.getLocalTermsByParent(this.column.code)
          //       // console.log("Saved ======================+>", nextChildren)
          //       /**reset Next level children */
          //       // this.column.children = this.column.children.map(col => { col.selected = false; return col })
          //       // mer.selected = false
          //       mer.children = ([...this.column.children.filter(x => { return x.code === mer.code }).map(a => a.children)].shift() || [])
          //       return mer
          //     })
          //   // this.updateTerms()
          setTimeout(() => {
            this.setConnectors(e.cardRef, next && next.index < this.column.index ? [] : this.columnData, 'ALL')
          }, 100);
          // console.log(this.columnData)
        }

        if (next && next.index < this.column.index) {
          this.columnData = [];
        }
      }
    })
    if (this.newTermSubscription) {
      this.newTermSubscription.unsubscribe()
    }
    this.newTermSubscription = this.frameworkService.insertUpdateDeleteNotifier.subscribe(e => {
      console.log('newTermSubscription ::', e)
      if (e && e.action) {
        const next = this.frameworkService.getNextCategory(e.action);
        if(next) {
          if (this.column.code === next.code && e.type === 'select') {
            this.insertUpdateHandler(e, next)
          } 
          if(e.type === 'update') {
            if(this.column.code === next.code && e.type === 'update') {
              // this.column = this.frameworkService.list.get(e.action)
              console.log('update event section')
              
              const selectedParent = this.frameworkService.getPreviousCategory(e.action);
              const selectedParentData = this.frameworkService.list.get(selectedParent.code)
              const selectedParentCardRef = this.frameworkService.selectionList.get(selectedParent.code) && 
              this.frameworkService.selectionList.get(selectedParent.code).cardRef
              console.log('selectedParentCardRef', selectedParentCardRef)
              if(selectedParent) {
                console.log('selectedParent', selectedParent)
                // this.insertUpdateHandler(e, next, 'update')
                // this.column = this.frameworkService.list.get(e.action)
                // this.column = this.frameworkService.list.get()
                this.frameworkService.currentSelection.next({ type: selectedParent.code, data:selectedParentData.children[0], cardRef:selectedParentCardRef, isUpdate: true})
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
    // console.log('current Saved ===========>', this.frameworkService.getLocalTermsByCategory(this.column.code))
    const localTerms = []
    this.frameworkService.getLocalTermsByCategory(this.column.code).forEach(f => {
      const selectedParent = back ? this.frameworkService.selectionList.get(back.code) : null; //can use current
      console.log('insertUpdateHandler selectedParent', selectedParent)
      if (selectedParent && ((f.parent.code === selectedParent.code) || (f.parent.identifier && (f.parent.identifier === selectedParent.identifier)))) {
        localTerms.push(f.term)
      }
    })
    if(!isUpdate) {
      console.log('insertUpdateHandler localTerms', localTerms)
    // get last parent and filter Above
    this.columnData = [...localTerms, ...(e.data.children || [])]
      .filter(x => {
        return x.category == this.column.code
      }).map(mer => {
        //**read local children for next */
        // const nextChildren = this.frameworkService.getLocalTermsByParent(this.column.code)
        // console.log("Saved ======================+>", nextChildren)
        /**reset Next level children */
        this.column.children = this.column.children.map(col => { col.selected = false; return col })
        mer.selected = false
        mer.children = ([...this.column.children.filter(x => { return x.code === mer.code }).map(a => a.children)].shift() || [])
        return mer
      });

    if(this.columnData.length > 0) {
      this.cardsCount.emit({category: this.columnData[0].category,count:this.columnData.length});
    } else {
      this.cardsCount.emit({category: this.column.code,count: 0});
    }
    // this.updateTerms()

    // console.log(this.columnData)
    }
  }
  updateSelection1(data: any) { }
  updateSelection(selection: any) {
    // console.log(selection.element.code, selection.isSelected)
    // if(this.column.code==='medium'){
    // console.log( this.column.children)
    // }
    // if (selection.element.category === this.column.code) {
    //   this.updateTaxonomyTerm.emit({ isSelected: selection.isSelected, selectedTerm: selection.element })
    // }
    // this.column.children = this.column.children.map(col => {
    //   if (col.code === selection.element.code) {
    //     col.selected = true
    //   } else {
    //     col.selected = false
    //   }
    //   return col
    // })
    console.log(selection)
  }

  get columnItems() {
    // const selected = this.column.children.filter(f => { return f.selected })
    // if (selected.length > 0) {
    //   const data = this.columnData.map(cd => {
    //     cd.selected = this.column.children.filter(f => { return cd.identifier === f.identifier }).map(s => s.selected)[0]
    //     return cd
    //   })
    //   return data
    // } else {
    let localSearchValue = this.searchValue.value
    let filteredColumnData = []
    if(localSearchValue) {
      filteredColumnData = this.columnData.filter((child: any) => {
        if(child.name.toLowerCase().includes(localSearchValue) || 
        (_.get(child, 'refId') && _.get(child, 'refId').toLowerCase().includes(localSearchValue)) || 
        (_.get(child, 'description') && _.get(child, 'description').toLowerCase().includes(localSearchValue))||
        (_.get(child, 'additionalProperties.displayName') && _.get(child, 'additionalProperties.displayName').toLowerCase().includes(localSearchValue))) {
          return child
        }
      })
    } else {
      filteredColumnData = this.columnData
    }
    
    return filteredColumnData ? filteredColumnData.slice(this.startIndex, this.currentLastIndex) : []
    // }
  }

  searchFilterData(ele: any){
    const back = this.frameworkService.getPreviousCategory(this.column.code)
    if(back && back.code) {
      let backColumData = this.frameworkService.selectionList.get(back.code)
      if(backColumData.category) {
        this.frameworkService.removeOldLine()
      
        setTimeout(() => {
          this.frameworkService.currentSelection.next({ type: backColumData.category, data: backColumData, cardRef: backColumData.cardRef })
        }, 200)
      }
    }
   }

  clearSearch() {
    this.searchValue.setValue('')
  }

  loadMore() {
    this.currentLastIndex = this.currentLastIndex + this.limitToAdd
    this.searchFilterData(this.searchValue.value)
  }

  setConnectors(elementClicked, columnItem, mode) {
    this.removeConnectors(elementClicked, 'box' + (this.column.index - 1), this.column.index - 1)
    // console.log('mode', mode)
    // console.log('child ', columnItem)
    // console.log('elementClicked', elementClicked)
    // console.log('connectorMapping', this.connectorMapping)
    if (mode === 'ALL') {
      // let tempconnectorMapping = {}
      // this.connectorService.updateConnectorsMap(tempconnectorMapping)
      // {
      //   ['column' + (this.column.index- 1)]: ''

      // }
      const ids = columnItem.map((c, i) => {
        return this.column.code + 'Card' + (i + 1)
      })
      this.connectorMapping['box' + (this.column.index - 1)] = { source: elementClicked, lines: (ids || []).map(id => { return { target: id, line: '', targetType: 'id' } }) }
      this.connectorService.updateConnectorsMap(this.connectorMapping)
      // console.log('next', next)
      const connectionLines = this.connectorService._drawLine(
        this.connectorMapping['box' + (this.column.index - 1)].source,
        this.connectorMapping['box' + (this.column.index - 1)].lines,
        null,
        '#box' + (this.column.index - 1),
        '#box' + this.column.index
      )
      this.connectorMapping['box' + (this.column.index - 1)].lines = connectionLines
      // console.log('this.connectorMapping :: ----------------------', this.connectorMapping)
      // if (cat.code === 'board') {
      //   this.connectorService._drawLine('box0card0', this.connectorMapping['board']['box0card0'], {
      //     startPlug: 'disc', endPlug: 'disc', color: 'black'
      //   }, 'box0', 'box1')
      // } else if (cat.code === 'medium') {
      //   this.connectorService._drawLine('box1card1', this.connectorMapping['medium']['box1card1'], {
      //     startPlug: 'disc', endPlug: 'disc', color: 'black'
      //   }, 'box0', 'box1')
      // } else if (cat.code === 'gradeLevel') {
      //   this.connectorService._drawLine('box2card7', this.connectorMapping['grade']['box2card7'], {
      //     startPlug: 'disc', endPlug: 'disc', color: 'black'
      //   }, 'box0', 'box1')
    } else {
      // console.log('inside else')
      // console.log('this.column', this.column)
      const item = this.column.children.findIndex(c => c.selected) + 1
      if (this.column.index > 1) {
        this.connectorMapping['box' + (this.column.index - 1)].lines = [{ target: elementClicked, line: '', targetType: 'element' }]

        this.connectorService.updateConnectorsMap(this.connectorMapping)
        const connectionLines = this.connectorService._drawLine(
          this.connectorMapping['box' + (this.column.index - 1)].source,
          this.connectorMapping['box' + (this.column.index - 1)].lines,
          null,
          '#box' + (this.column.index - 1),
          '#box' + this.column.index
        )
        this.connectorMapping['box' + (this.column.index - 1)].lines = connectionLines
        // console.log('this.connectorMapping :: ----------------------', this.connectorMapping)
      }

    }
    this.connectorService.updateConnectorsMap(this.connectorMapping)

  }
  removeConnectors(currentElement, prevCol, currentIndex) {
    console.log('prevCol ------------', prevCol)
    if (this.connectorMapping) {
      for (const key in this.connectorMapping) {
        // Remove all n-1 lines and keep only current selection, also clear n+1 lines
        if (this.connectorMapping[key] && this.connectorMapping[key].lines && this.connectorMapping[key].lines.length > 0) {
          const lines = this.connectorMapping[key].lines
          lines.forEach(async (element, index) => {
            if (element != currentElement && prevCol == key) {
              await element.line && element.line.remove();
              lines.splice(index, 1);
            }
          });
          this.connectorMapping[key].lines = lines
        }

        // remove all n+2 lines, if clicks previous columns and tree was already drilled down
        let count = currentIndex + 2;
        let nextCol = `box${count}`
        if (this.connectorMapping[nextCol] && this.connectorMapping[nextCol].lines && this.connectorMapping[nextCol].lines.length > 0) {
          const lines = this.connectorMapping[nextCol].lines
          lines.forEach(async (element, index) => {
            await element.line && element.line.remove();
            lines.splice(index, 1);
          })
          this.connectorMapping[nextCol].lines = null
        }
      }

    }
  }
  selectedCard(event){
    this.updateTermList.emit(event);
  }

  get showLoadMoreBtn(): boolean {
    if(this.column && this.column.config && this.column.config.categoryDisplayName !== 'Organisation' 
      && this.column.name !== 'Organisation' && this.columnItems && this.columnItems.length > 0) {
        return true
      }
    return false
  }

  get disableLoadButton(): boolean {
    if(this.columnData && this.columnData.length < this.currentLastIndex) {
      return true
    }
    return false
  }

  ngOnDestroy(): void {
    if (this.childSubscription) {
      this.childSubscription.unsubscribe()
    }
    if(this.newTermSubscription) {
      this.newTermSubscription.unsubscribe()
    }
  }
  
}