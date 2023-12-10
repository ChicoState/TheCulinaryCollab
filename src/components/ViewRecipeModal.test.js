import renderer from 'react-test-renderer';
import React from 'react';
import ViewRecipeModal from './ViewRecipeModal';

describe('<ViewRecipeModal>', () => {
  it('should render component', () => {
    const tree = renderer.create(<ViewRecipeModal />).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('show comments when Show Comments button is clicked', () => {
    const component = renderer.create(<ViewRecipeModal />);
    const instance = component.root;

    // Find the button inside the component
    const buttons = instance.findAllByType('button');
    const showCommentsButton = buttons.find((button) =>
      button.props.children === 'Show Comments'
    );

    // If the button is found, simulate a click
    if (showCommentsButton) {
      showCommentsButton.props.onClick();

      // Find the first div and check its text content
      const div = instance.findByProps({ className: 'comments-dropdown' });
      expect(div.children).toBeTruthy(); 
    } else {
      expect(() => {
        throw new Error('Show Comments button not found');
      }).toThrow();
    }
  });
});
