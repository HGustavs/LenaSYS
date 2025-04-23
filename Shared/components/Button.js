class Button extends React.Component {
    render() {
        const { onClick, children, ...rest } = this.props;
        return (
            <button onClick={onClick}{...rest}>
                {children}
            </button>
        );
    }
}