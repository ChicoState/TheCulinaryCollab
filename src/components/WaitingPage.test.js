import renderer from 'react-test-renderer';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import WaitingPage from './WaitingPage';

jest.mock('react-router-dom');
jest.mock('../firebase');

const renderTree = tree => renderer.create(tree);
describe('<WaitingPage>', () => {
  it('should render component', () => {
    expect(renderTree(<WaitingPage 
    />).toJSON()).toMatchSnapshot();
  });

  
  
});