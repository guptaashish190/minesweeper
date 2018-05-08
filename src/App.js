import React, { Component } from 'react';
import styled from 'styled-components';

var Grid5 = styled.div`
  width: 400px;
  height: 400px;
  display : grid;
  grid-template-columns: repeat(5,1fr);
  font-size: 1.3em;
`;
var Grid10 = styled.div`
  width: 500px;
  height: 500px;
  display : grid;
  grid-template-columns: repeat(10,1fr);
  font-size: 1.8em;
`;
var Grid15 = styled.div`
  width: 500px;
  height: 500px;
  display : grid;
  grid-template-columns: repeat(15,1fr);
  font-size: 1.5em;
`;
var BoxStyle = styled.div`
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
    difficulty: 5,
    gameOver: false
  }

  initBoard = () => {
    let board = [];
    for (let i = 0; i < this.state.difficulty; i++) {
      for (let j = 0; j < this.state.difficulty; j++) {

        if (board[i] === undefined) {
          board[i] = [];
        }
        board[i][j] = Math.random() > 0.7 ? 'mine' : 0;
      }
    }
    return board;
  }

  addOneIfNotMine(i, j) {
    if (i === -1 || i === this.state.difficulty || j === -1 || j === this.state.difficulty) {
      return
    }
    if (this.boardList[i][j] != 'mine') {
      this.boardList[i][j]++;
    }
  }

  boardList = this.initBoard();

  scanBoard = () => {

    for (let i = 0; i < this.state.difficulty; i++) {
      for (let j = 0; j < this.state.difficulty; j++) {
        let current = this.boardList[i][j];
        if (current === 'mine') {
          this.addOneIfNotMine(i - 1, j - 1);
          this.addOneIfNotMine(i, j - 1);
          this.addOneIfNotMine(i + 1, j - 1);
          this.addOneIfNotMine(i + 1, j);
          this.addOneIfNotMine(i + 1, j + 1);
          this.addOneIfNotMine(i, j + 1);
          this.addOneIfNotMine(i - 1, j + 1);
          this.addOneIfNotMine(i - 1, j);
        }
      }
    }
    return this.boardList;
  }
  gameOverHandler = () => {
    let cState = this.state;
    cState.gameOver = true;
    this.setState(cState);
  }
  setBoard = (boardList) => {
    let boardMap = [];
    for (let i = 0; i < this.state.difficulty; i++) {
      for (let j = 0; j < this.state.difficulty; j++) {
        if (boardMap[i] === undefined) {
          boardMap[i] = [];
        }
        boardMap[i][j] = <Box onGameOver={() => { this.gameOverHandler() }} reinit={() => this.reInit()} key={this.key++} value={boardList[i][j]} />;
      }
    }
    return boardMap;
  }

  reInit = () => {
    this.initBoard();
    this.boardList = this.initBoard();
    this.forceUpdate();

    let cState = this.state;
    cState.gameOver = false;
    this.setState(cState)
  }
  key = 0;

  setDifficulty = (difficulty) => {
    let cState = this.state;
    cState.difficulty = difficulty;
    this.setState(cState);
    this.initBoard();
    this.boardList = this.initBoard();
  }

  setGrid = (difficulty) => {

    if (difficulty === 5) {
      return (<Grid5 className="App">
        {this.setBoard(this.boardList)}
      </Grid5>);
    } else if (difficulty === 10) {
      return (<Grid10 className="App">
        {this.setBoard(this.boardList)}
      </Grid10>);
    } else {
      return (<Grid15 className="App">
        {this.setBoard(this.boardList)}
      </Grid15>);
    }
  }
  render() {
    this.scanBoard(this.initBoard());

    return (
      <div className="wrapper">
        {this.setGrid(this.state.difficulty)}

        <div className="game-over-div">{this.state.gameOver ? "Game Over" : ""}</div>

        <Options setDifficulty={(difficulty) => this.setDifficulty(difficulty)} />

      </div>
    );
  }
}
class Options extends Component {

  setDifficulty = (difficulty) => {
    this.props.setDifficulty(difficulty);
  }

  render() {
    return (
      <div className="options">
        <ul>
          <li onClick={() => { this.setDifficulty(5) }}>5X5</li>
          <li onClick={() => { this.setDifficulty(10) }}>10X10</li>
          <li onClick={() => { this.setDifficulty(15) }}>15X15</li>
        </ul>
      </div>
    );
  }

}
class Box extends Component {
  state = {
    visible: false,
    flagged: false
  }

  setVisible = (dontCheck) => {
    this.setState({ visible: true, flagged: this.state.flagged });

    if (!dontCheck) this.checkMine();

  }
  checkMine = () => {
    if (this.props.value === 'mine') {
      this.setVisible(true);
    }
  }
  flag = (e) => {
    if (e.button === 1) {
      this.setState(
        {
          visible: this.state.visible,
          flagged: !this.state.flagged
        }
      );
    }
  }


  render() {
    if (this.state.flagged === true) {
      return <BoxStyle onMouseDown={e => { this.flag(e) }} className="box"><img src="images/flag.png" width="20px" height="20px" /></BoxStyle>
    }
    else if (this.state.visible === true) {
      if (this.props.value === 'mine') {
        return <BoxStyle className="box"><img src="images/mine.png" width="30px" height="30px" /></BoxStyle>
      } else if (this.props.value === 0) {
        return <BoxStyle className="box zeroBox"></BoxStyle>
      } else {
        return <BoxStyle className="box">{this.props.value}</BoxStyle>
      }
    } else {
      return <BoxStyle onMouseDown={e => { this.flag(e) }} onClick={() => this.setVisible()} className="box"><div className="empty-box"></div></BoxStyle>
    }
  }
}
export default App;
