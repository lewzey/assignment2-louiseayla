import HeaderMenu from './HeaderMenu.jsx';
const HeaderApp = (props) => {
    return (
        <header className="header">
            <HeaderMenu setIsLoading={props.setIsLoading} />
        </header>
    );
}
export default HeaderApp;
