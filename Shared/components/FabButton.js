// FabButton.js
class FabButton extends React.Component {
    constructor(props) {
      super(props);
      this.handleClick = this.handleClick.bind(this);
      this.handleKeyDown = this.handleKeyDown.bind(this);
    }
    
    handleClick() {
      window.newCourse();
    }
    
    handleKeyDown(e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.handleClick();
      }
    }
    
    render() {
      return React.createElement('div', { className: 'fixed-action-button extra-margin' },
        React.createElement('a', {
          className: 'btn-floating fab-btn-lg noselect',
          onClick: this.handleClick,
          onKeyDown: this.handleKeyDown,
          tabIndex: '0',
          role: 'button',
          'aria-label': 'Add new course'
        }, '+')
      );
    }
  }
  
  // Export globally
  window.FabButton = FabButton;