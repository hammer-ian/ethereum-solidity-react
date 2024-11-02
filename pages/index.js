import Layout from '../components/Layout';
import { Button } from 'semantic-ui-react';
import Link from 'next/link';

function App () {

    return(
        //check Layout.js in Components directory. Custom file to create a layout
        //any content between the Layout tags gets passed to Layout.js as props.children
        <Layout>
            <h1>KickStarter Home Page</h1>
            <Link href='campaigns'>View Campaigns</Link>
            
        </Layout>
    );
}

export default App;