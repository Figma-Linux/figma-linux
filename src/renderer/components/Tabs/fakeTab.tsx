import * as React from 'react';

interface Props {
    id: number;
}

const FakeTab: React.SFC<Props> = (props) => {
    return <div className="fakeTab"></div>

}

export default FakeTab;