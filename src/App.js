import React, { Component } from 'react';
import styled from 'styled-components';

var Grid5 = styled.div`
  display : grid;
  grid-template-columns: repeat(5,1fr);
  font-size: 1.3em;
`;
var Grid8 = styled.div`
  display : grid;
  grid-template-columns: repeat(5,1fr);
`;
var Grid13 = styled.div`
  display : grid;
  grid-template-columns: repeat(5,1fr);
`;

var BoxStyle = styled.div`
  width: 90px;
  height: 90px;
  background : lightgreen
  border-radius: 4px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 2px;
  box-shadow: 0px 0px 10px #00e240 inset;
`;
class App extends Component {

  state = {
    difficulty: 5
  }

  initBoard = () => {
    let board = [];
    for (let i = 0; i < this.state.difficulty; i++) {
      for (let j = 0; j < this.state.difficulty; j++) {

        if (board[i] === undefined) {
          board[i] = [];
        }
        board[i][j] =Math.random() > 0.7 ? 'mine' : 0;
      }
    }
    return board;
  }

  addOneIfNotMine(i,j){
    if(i === -1 || i === this.state.difficulty || j === -1 || j === this.state.difficulty){
      return
    }
    if(this.boardList[i][j] != 'mine'){
      this.boardList[i][j]++;
    }
  }

  boardList = this.initBoard();

  scanBoard = () => {

    for (let i = 0; i < this.state.difficulty; i++) {
      for (let j = 0; j < this.state.difficulty; j++) {
        let current = this.boardList[i][j];
        if (current === 'mine') {
            this.addOneIfNotMine(i-1,j-1);
            this.addOneIfNotMine(i,j-1);
            this.addOneIfNotMine(i+1,j-1);
            this.addOneIfNotMine(i+1,j);
            this.addOneIfNotMine(i+1,j+1);
            this.addOneIfNotMine(i,j+1);
            this.addOneIfNotMine(i-1,j+1);
            this.addOneIfNotMine(i-1,j);
        }
      }
    }
    return this.boardList;
  }

  setBoard = (boardList)=>{
    let boardMap = [];
    for(let i = 0; i< this.state.difficulty ; i++){
      for(let j = 0; j< this.state.difficulty ; j++){
        if (boardMap[i] === undefined){
          boardMap[i] =[];
        }
        boardMap[i][j] = <Box key = {this.key++} value = {boardList[i][j]}/>;
    }
  }
  return boardMap;
}


  setAllVisible = ()=>{

  }
  key = 0;

  render() {
    this.scanBoard(this.initBoard());
    return (
      <div className="wrapper">
      <Grid5 className="App">
        {this.setBoard(this.boardList)}
      </Grid5>
      </div>
    );
  }
}

class Box extends Component {
  state = {
    visible : false,
    flagged: false
  }

  setVisible = ()=>{
    this.setState({visible: true, flagged: this.state.flagged});
    this.checkMine();
  }
  checkMine = ()=>{
    if(this.props.value === 'mine'){
    //  alert("Bhai haar gaya");
      return true;
    }
    else{
      return false;
    }
  }
  flag = (e)=>{
    if(e.button === 1){
     this.setState(
      {
        visible: this.state.visible,
        flagged: !this.state.flagged
      }
    );
  }
  }


  render() {
    if(this.state.flagged === true){
     return <BoxStyle onMouseDown = {e => {this.flag(e)} } className="box"><img src = "images/flag.png" width = "20px" height = "20px"/></BoxStyle>
    }
    else if(this.state.visible === true){
      return <BoxStyle  onClick = {()=>this.setVisible()} className="box">{this.props.value === 'mine' ? <img src="images/mine.png" width="30px" height="30px" /> : this.props.value}</BoxStyle> 
    }else{
      return <BoxStyle onMouseDown = {e => {this.flag(e)} } onClick = {()=>this.setVisible()} className="box"></BoxStyle>
    }
  }
}
export default App;
