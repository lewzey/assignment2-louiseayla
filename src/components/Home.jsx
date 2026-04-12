import { useEffect } from 'react';

const Home = (props) => {
    useEffect(() => {
        if (typeof props.setIsLoading === 'function') {
            props.setIsLoading(false);
        }
    }, [props.setIsLoading]);

    return (
        <div>
            <hi> TESTING TESTING </hi>
        </div>
    );
}

export default Home;