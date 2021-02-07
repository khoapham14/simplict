import renderer from 'react-test-renderer';

import Timer from './Components/timer.js';
import Stats from './Components/statistics.js';
import Scrambler from './Components/scrambler.js';

it('Timer renders correctly', () => {
    const tree = renderer.create(<Timer />).toJSON();
    expect(tree).toMatchSnapshot();
});


it('Stats renders correctly', () => {
    const tree = renderer.create(<Stats />).toJSON();
    expect(tree).toMatchSnapshot();
});


it('Scrambler renders correctly', () => {
    const tree = renderer.create(<Scrambler />).toJSON();
    expect(tree).toMatchSnapshot();
});
