import { useEffect, useState } from 'react'
import './App.css'
import PageContainer from './container/PageContainer'
import Header from './components/Header'
import RouterConfig from './config/RouterConfig';
import Loading from './components/Loading'
import Drawer from '@mui/material/Drawer';
import { useDispatch, useSelector } from 'react-redux';
import { calculateBasket, setDrawer, removeFromBasket } from './redux/slices/basketSlice';

function App() {
  const [count, setCount] = useState(0)
  const { products, drawer, totalAmount } = useSelector((store) => store.basket);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(calculateBasket());
  }, [])
  return (
    <div>

      <PageContainer>

        <Header />
        <RouterConfig />
        <Loading />
        <Drawer className='drawer' onClose={() => dispatch(setDrawer())} anchor='right' open={drawer}>
          {
            products && products.map((product) => {
              return (
                <div>
                  <div className='flex-row' style={{ padding: '20px' }}>
                    <img style={{ marginRight: '5px' }} src={product.image} width={50} height={50} />
                    <p style={{ width: '320px', marginRight: '5px' }}>{product.title}({product.count})</p>
                    <p style={{ fontWeight: 'bold', marginRight: '10px', width: '60px' }}>{product.price}TL</p>
                    <button
                      onClick={() => dispatch(removeFromBasket(product.id))}
                      style={{
                        padding: '5px',
                        borderRadius: '5px',
                        backgroundColor: 'rgb(185,76,76)',
                        border: 'none',
                        color: 'white',
                        width: '50px',
                        cursor: 'pointer'
                      }}
                    >
                      Sil
                    </button>
                  </div>
                </div>
              )
            })
          }
          <div>
            <p style={{ textAlign: 'center' }}>Toplam Tutar:{totalAmount}</p>
          </div>
        </Drawer>

      </PageContainer>

    </div>
  )
}

export default App
