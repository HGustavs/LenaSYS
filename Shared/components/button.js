class Button extends React.Component {
    constructor(props) {
        super(props);
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        alert(`${this.props.label} clicked!`);
    }

    getButtonStyle(color, size) {
        const defaultStyle = { 
            border: 'none',
            borderRadius: '4px', 
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background 0.2s',
            color: 'white',
        };

        const colors = {
            white: { backgroundColor: '#ffffff' },
            black: { backgroundColor: '#000000' },
            gray: { backgroundColor: '#D3D3D3'}
        };

        const sizes = {
            small: { padding: '0.25rem 0.5rem', fontSize: '0.875rem' }, 
            medium: { padding: '0.5rem 1rem', fontSize: '1rem' },       
            large: { padding: '0.75rem 1.5rem', fontSize: '1.25rem' },  
        };

        //Default white
        if (!colors[color]) {
            color = 'white';
        }

        //Default medium
        if (!sizes[size]) {
            size = 'medium';
        }

        return { ...defaultStyle, ...colors[color], ...sizes[size] };
    }

    render() {
        const { label = "Click", color = "white", size = "large" } = this.props;
        const style = this.getButtonStyle(color, size);

        return (
            <button style={style} onClick={this.handleClick}>
                {label}
            </button>
        );
    }
}