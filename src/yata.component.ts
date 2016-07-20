import { CORE_DIRECTIVES }      from '@angular/common';
import { AfterViewInit,
         Component,
         ElementRef,
         EventEmitter,
         forwardRef,
         Input,
         Output,
         Provider,
         QueryList,
         Renderer,
         ViewChild,
         ViewChildren }         from '@angular/core';
import { NG_VALUE_ACCESSOR,
         ControlValueAccessor } from '@angular/forms';


const YATA_VALUE_ACCESSOR: Provider = new Provider(
  NG_VALUE_ACCESSOR,
  {
    useExisting: forwardRef(() => Yata),
    multi: true
  }
);

@Component({
  selector: 'yata',
  template: require('./yata.component.html'),
  providers: [ YATA_VALUE_ACCESSOR ],
  directives: [ CORE_DIRECTIVES ]
})
export class Yata implements AfterViewInit,
                             ControlValueAccessor {

  @Input() delay: number = 300;
  @Input() placeholder: string = '';
  @Input() suggestions: any[];
  @Input() style: any;
  @Input() styleClass: string;
  @Input() inputStyle: any;
  @Input() inputStyleClass: string;

  @Output() onComplete = new EventEmitter();

  @ViewChild('taInput') input: ElementRef;
  @ViewChild('taDropdown') dropdown: ElementRef;
  @ViewChildren('taItem') items: QueryList<ElementRef>;

  private value: string;
  private lastValue: string;
  private onModelChange: Function = () => {};
  private onModelTouched: Function = () => {};
  private timeout: any;
  private globalClickListener: any;
  private selectedItem: ElementRef;

  constructor(private renderer: Renderer) { }

  ngAfterViewInit() {
    this.globalClickListener = this.renderer.listenGlobal(
      'body',
      'click', () => {
        this.hide();
      }
    );
  }

  onInput(event: any) {
    this.value = event.target.value;

    let end = this.value.lastIndexOf(' ') || 0
    this.lastValue = this.value.substr(
      end === 0 ? end : end + 1,
      this.value.length
    )

    clearTimeout(this.timeout);
    this.timeout = setTimeout(() => {
      this.onModelChange(this.value);
      this.onComplete.emit({value: this.value, lastValue: this.lastValue});
    }, this.delay);
  }

  onItemSelect(suggestion: string) {
    this.lastValue = '';

    let end = this.value.lastIndexOf(' ') || 0;
    this.value = this.value.substr(
      0,
      end === 0 ? 0 : end + 1
    ) + suggestion + ' ';
    this.onModelChange(this.value);
    this.onComplete.emit({value: this.value, lastValue: this.lastValue});
  }

  onKeyDown(event: any) {
    if (!this.suggestions)
      return;

    switch(event.which) {
      case 13: // enter
        if (this.selectedItem)
          this.onItemSelect(this.selectedItem.nativeElement.innerText);
        this.hide();
        event.preventDefault();
        break;
      case 27: // escape
        this.hide();
        this.selectedItem = null;
        event.preventDefault();
        break;
      case 38: // up
      case 40: // down
        this.moveSelection(event.which);
        event.preventDefault();
        break;
    }
  }

  moveSelection(key: number) {
    if (this.selectedItem) {
      this.renderer.setElementClass(this.selectedItem.nativeElement,
                                    'selected',
                                    false);
    }

    let items = this.items.toArray();
    let index = items.indexOf(this.selectedItem);

    if (key === 38) { // up
      if (!this.selectedItem || this.selectedItem === this.items.first)
        this.selectedItem = this.items.last;
      else
        this.selectedItem = items[index - 1];
    } else if (key === 40) { // down
      if (!this.selectedItem || this.selectedItem === this.items.last)
        this.selectedItem = this.items.first;
      else
        this.selectedItem = items[index + 1];
    }

    this.renderer.setElementClass(this.selectedItem.nativeElement,
                                  'selected',
                                  true);
  }

  hide() {
    this.suggestions = [];
  }

  writeValue(value: any) : void {
      this.value = value;
  }

  registerOnChange(fn: Function): void {
      this.onModelChange = fn;
  }

  registerOnTouched(fn: Function): void {
      this.onModelTouched = fn;
  }
}
