import React from "react";
import { Menu } from 'semantic-ui-react';
import Link from 'next/link';

export default () => {
    return (
        <Menu style={ {marginTop: '10px'} }>
            <Link href='/'className="item">CrowdCoin</Link>
            <Menu.Menu position="right">
                <Link href='/'className="item">Campaigns</Link>
                <Link href='/campaigns/newCampaign' className="item">+</Link>
            </Menu.Menu>
        </Menu>
    );
};