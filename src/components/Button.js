import React from 'react';

export const Button = (props) => {
    let styles = {
      position: 'absolute',
      zIndex: '100',
      left: '20px',
      bottom: '40px',
      padding: '10px',
      fontSize: '15px'
    };
    return (
      <button style={styles} onClick={props.changeBasemap}>VAHETA ALUSKAARTI</button>
    )
}
