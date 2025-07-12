import React, { useEffect, useContext } from 'react';
import WhotGame from '../components/whot/WhotGame';
import { StoreContext } from '../store';
import { setGameBackground } from '../store/actions';

const Whot: React.FC = () => {
  const { dispatch } = useContext(StoreContext);

  useEffect(() => {
    dispatch(setGameBackground(true));

    return () => {
      dispatch(setGameBackground(false));
    }
  }, [dispatch]);

  return <WhotGame />;
};

export default Whot; 