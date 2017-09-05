import React, { Component } from 'react';
import Modal from 'react-modal';
import ReactDOM from 'react-dom';
import './canvas.css';

const mouse = {
  x: -1,
  y: -1
}

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

let arrLength = 0;
let arrLines = [];
let tempArray = [];


class Canvas extends Component {
  constructor(props) {
    super(props);
    this.state = {
      widthLines: '1', 
      colorLines: '#000000', 
      modalIsOpen: false,
      widthCanvas: 640,
      heightCanvas: 480
    };
    this.canvasDrow = this.canvasDrow.bind(this);
    this.canvasClick = this.canvasClick.bind(this);
    this.widthChange = this.widthChange.bind(this);
    this.colorChange = this.colorChange.bind(this);
    this.resetClick = this.resetClick.bind(this);
    this.undoClick = this.undoClick.bind(this);
    this.redoClick = this.redoClick.bind(this);
    this.saveClick = this.saveClick.bind(this);
    this.openClick = this.openClick.bind(this);
    this.openModal = this.openModal.bind(this);
    this.afterOpenModal = this.afterOpenModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

// **************************************************
  componentDidMount() {
    this.updateCanvas();
  }

// **************************************************  
  componentDidUpdate() {
    this.updateCanvas();
  }

// **************************************************
    updateCanvas() {
      tempArray = arrLines.slice(0, arrLines.length -arrLength);
      const ctx = this.refs.canvas.getContext('2d');
      ctx.clearRect(1, 1, this.refs.canvas.width, this.refs.canvas.height);
      for (let i=0; i< tempArray.length; i++) {
        this.canvasDrow(
            tempArray[i].x1,
            tempArray[i].x2, 
            tempArray[i].y1, 
            tempArray[i].y2, 
            tempArray[i].width, 
            tempArray[i].color
        );
      }
  }

// **************************************************
    canvasDrow (x1,x2,y1,y2,width,color) {
      const ctx = this.refs.canvas.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(x1,x2);
      ctx.lineTo(y1,y2);
      ctx.lineWidth = width;
      ctx.strokeStyle = color;
      ctx.closePath();
      ctx.stroke();
    }
// **************************************************

  canvasClick (e) {
    const lineWidth = document.getElementById('lineWidth');
    const lineColor = document.getElementById('lineColor');
    if(mouse.x !== -1 && mouse.y !== -1){
        if (arrLength>0) 
          {
            arrLines.length = arrLines.length - arrLength;
            arrLength = 0;
          }
         arrLines.push({
          x1: mouse.x, 
          x2: mouse.y, 
          y1: e.pageX,
          y2: e.pageY, 
          width: lineWidth.value, 
          color: lineColor.value
        })
        this.updateCanvas();  
        mouse.x = -1;
        mouse.y = -1;
    } else
    {
        mouse.x = e.pageX;
        mouse.y = e.pageY;
    }
    
    
}

// **************************************************
  widthChange(e) {
    if (e.target.value >0){
    this.setState({widthLines: e.target.value});
    }
    else
      {
        this.setState({widthLines: 1});
      }
    };
// **************************************************

  colorChange(e) {this.setState({colorLines: e.target.value});};

// **************************************************  
  resetClick() {
    const ctx = this.refs.canvas.getContext('2d');
    ctx.clearRect(1, 1, this.refs.canvas.width, this.refs.canvas.height);
    arrLines = [];
    tempArray = [];
  }
// **************************************************
  undoClick() {
      if (arrLines.length>arrLength){
        arrLength++;
        this.updateCanvas();
      } 
      else console.log('not element to arrLines')
  }
// **************************************************
  redoClick() {
    if (arrLength > 0 ){
      arrLength--;
      this.updateCanvas();
    } 
    else console.log('arrLines is max')
  }
// ************************************************** 
  saveClick() {
    if (tempArray.length >0) { 
      let ObjLines = JSON.stringify(tempArray);
      localStorage.setItem("drawLines", ObjLines);
    } else alert('no items');
  }
// **************************************************
  openClick(){
    if (tempArray.length >0) { 
      let ObjLines = localStorage.getItem("drawLines");
      arrLines = JSON.parse(ObjLines);
      arrLength = 0;
      this.updateCanvas();
    } else alert('no saved items');
    
  }

// **************************************************
  openModal() {
    this.setState({modalIsOpen: true});
  }

// ************************************************** 
  afterOpenModal() {
    this.subtitle.style.color = '#f00';
  }

// **************************************************
  closeModal() {
    this.setState({modalIsOpen: false});
  }  

// **************************************************
  onSubmit(e) {
    let maxHeight = '';
    let maxWidth  = '';
    tempArray = arrLines.slice(0, arrLines.length -arrLength);
    for (let i=0; i< tempArray.length; i++) {
      if (tempArray[i].x1 > maxWidth) maxWidth = tempArray[i].x1
        if (tempArray[i].y1 > maxWidth) maxWidth = tempArray[i].y1
      
      if (tempArray[i].x2 > maxHeight) maxHeight = tempArray[i].x2
        if (tempArray[i].y2 >maxHeight) maxHeight = tempArray[i].y2    
    }
    if (this.widthCanvasChange.value >= maxWidth){
      if (this.heightCanvasChange.value >= maxHeight) {
        this.setState({
          widthCanvas: this.widthCanvasChange.value, 
          heightCanvas: this.heightCanvasChange.value,
          modalIsOpen: false});
      } else alert('Height must be greater than ' + maxHeight);
    } else alert('Width must be greater than ' + maxWidth);
  }
  
// **************************************************
  render() {
    return (
      <div className="CanvasApp">
    
          <canvas className = 'canvas' ref="canvas" width={this.state.widthCanvas} height={this.state.heightCanvas} onClick = {this.canvasClick}/>
          <div>
            <input id="lineWidth" type="number" value={this.state.widthLines} onChange={this.widthChange} />
            <input id="lineColor" type="color" value={this.state.colorLines} onChange={this.colorChange} />
            <input type="button" value="Undo" onClick={this.undoClick} />
            <input type="button" value="Redo" onClick={this.redoClick} />
            <input type="button" value="Reset" onClick={this.resetClick} />
            <input type="button" value="Save" onClick={this.saveClick} />
            <input type="button" value="Open" onClick={this.openClick} />
            <input type="button" value="Canvas size" onClick={this.openModal} />
          </div>  
          <Modal
            isOpen={this.state.modalIsOpen}
            onAfterOpen={this.afterOpenModal}
            onRequestClose={this.closeModal}
            style={customStyles}
            contentLabel="Canvas size"
          >
          <div className='modalCanvas'>
            <h2 ref={subtitle => this.subtitle = subtitle}>Canvas size</h2>  
            <span>Width</span><input type="number" defaultValue={this.state.widthCanvas} ref={(el) => this.widthCanvasChange = el}/>
            <p />
            <span>Height</span><input type="number" defaultValue={this.state.heightCanvas} ref={(el) => this.heightCanvasChange = el}/>
            <p />
            <input type="button" value="Submit" onClick={this.onSubmit} />
            <input type="button" value="Close" onClick={this.closeModal} />
          </div>
          </Modal>
      </div>
    );
  }
}

ReactDOM.render(<Canvas/>, document.getElementById('canvas'));
