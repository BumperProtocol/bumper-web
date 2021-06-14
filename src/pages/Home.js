// bumper
import { useEffect, useState } from 'react';
import ctx, { mapData, unmapActions } from '../events';
import { getDefaultTheme } from '../utils';
import Button from '../components/Button';

const connectWallet = () => {
  ctx.event.emit('connectWallet');
}

const PageView = () => {
  let defaultTheme = getDefaultTheme();
  const [theme, setTheme] = useState(defaultTheme);

   // init
   useEffect(() => {
    const lifetimeObj = {};

    mapData({
      theme(value){
        setTheme(value)
      },
    }, ctx, lifetimeObj);
    return () => {
      unmapActions(lifetimeObj);
    }
  }, []);

  return (
    <div className="page-center">
      <Button theme={theme} onClick={connectWallet}>Unlock Wallet</Button>
    </div>
  )
};

export default PageView;
