/* eslint-disable */
import { ElementRef, Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { FrameworkService } from './framework.service';

declare var LeaderLine: any;

type plugType = 'disc' | 'square' | 'hand' | 'arrow1' | 'arrow2' | 'arrow3';
type pathType = 'straight' | 'arc' | 'fluid' | 'magnet' | 'grid';


export interface LLOptions {
  startPlug: plugType,
  startPlugColor?: string,
  startPlugOutlineColor?: string,
  endPlug: plugType,
  endPlugColor?: string,
  endPlugOutlineColor?: string,
  color?: string,
  size?: number,
  path?: pathType,
};

const defaultConfig = {
  startPlug: 'disc',
  startPlugColor: 'white',
  startPlugOutlineColor: '#515151',
  endPlug: 'disc',
  endPlugColor: 'white',
  endPlugOutlineColor: '#515151',
  color: '#515151',
  size: 4,
  path: 'grid'
}

@Injectable()
export class ConnectorService {
  connectorMap: any = {}
  // assuming following structure
  // {
  //   'box1': {
  //     source: ElementRef,
  //     lines: [
  //       {
  //         target:' card2 of box1', 
  //         line: '_line prototype object'
  //       }
  //     ]
  //   }
  // }

  constructor(private frameworkService: FrameworkService) { 
    this.frameworkService.list.map(list => {
      this.connectorMap['box'+list.index]= {}
    })
    console.log('connectorMap -------', this.connectorMap)
  }

  _drawLine(source, target, options: LLOptions, sourceContainerId = undefined, targetContainerId = undefined) {
    console.log('sourceContainerId ::', sourceContainerId)
    console.log('targetContainerId ::', targetContainerId)
    const _options = <LLOptions>{...defaultConfig, ...options}
    let _line;
    if (Array.isArray(target)) {
      // target.forEach((_target) => {
      //   _line = this.renderLine(source, _target, _options);
      // });
      let connectedDots = [];
      target.forEach((_target) => {
        const tempLine = this.renderLine(source, _target, _options)
        connectedDots.push(
        {
          target: _target, // ref element
          line: tempLine
        })
        if(sourceContainerId) {
          document.querySelector(sourceContainerId).addEventListener('scroll', () => {
            tempLine.position();
          }, false);
        }
        if (targetContainerId) {
          document.querySelector(targetContainerId).addEventListener('scroll', () => {
            tempLine.position();
          }, false);
        }

      });
    return connectedDots;
    } else {
      _line = this.renderLine(source, target, _options);
    }
    if(sourceContainerId) {
      document.querySelector(sourceContainerId).addEventListener('scroll', () => {
        _line.position();
      }, false);
    }
    if (targetContainerId) {
      document.querySelector(targetContainerId).addEventListener('scroll', () => {
        _line.position();
      }, false);
    }
  }

  private renderLine(source, target, options: LLOptions) {
    let _options = {
      animOptions: { duration: 3000, timing: 'linear' },
      hide: true,
    };
    let _line
    if(target.targetType === 'id'){
      _line = new LeaderLine(source, document.getElementById(target.target), _options);
    }
    else {
      _line = new LeaderLine(source, target.target, _options);
    }

    _line.endPlugOutline = true;
    _line.startPlugOutline = true;
    _line.setOptions(options);
    _line.show('draw');
    return _line;
  }

  updateConnectorsMap(map){
    this.connectorMap = map
  }
}
