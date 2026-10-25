import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { setSelectedProduct } from '../redux/slices/productSlice';
import { CiCirclePlus } from 'react-icons/ci';
import { CiCircleMinus } from 'react-icons/ci';
import { addToBasket, calculateBasket } from '../redux/slices/basketSlice';

function ProductDetails() {
    const { id } = useParams();
    const { products, selectedProduct } = useSelector
        ((store) => store.product)

    const { price, image, title, description } = selectedProduct;

    const [count, setCount] = useState(0);

    const dispatch = useDispatch();

    const increment = () => {
        setCount(count + 1)
    }
    const decrement = () => {
        setCount(count - 1)
    }

    const addBasket = () => {
        const payload = {
            id,
            price,
            image,
            title,
            description,
            count
        }

        dispatch(addToBasket(payload));
        dispatch(calculateBasket());
    }

    useEffect(() => {
        getProductById();
    }, [])

    const getProductById = () => {
        products && products.map((product) => {
            if (product.id == id) {
                dispatch(setSelectedProduct(product));
            }
        })
    }

    return (
        <div style={{ marginTop: '30px', display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
            <div style={{ marginRight: '40px' }}>
                <img src={image} width={300} height={500} alt="" />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '20px' }}>
                <h2 style={{ fontFamily: 'arial' }}>{title}</h2>
                <p style={{ fontFamily: 'arial', fontSize: '20px' }}>{description}</p>
                <h1 style={{ fontSize: '40px', fontFamily: 'arial', fontWeight: 'bold', color: 'red' }}>{price}₺</h1>

                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CiCirclePlus onClick={increment} style={{ fontSize: '40px', marginRight: '5px', cursor: 'pointer' }} />
                    <span style={{ fontSize: '35px' }}>{count}</span>
                    <CiCircleMinus onClick={decrement} style={{ fontSize: '40px', marginLeft: '5px', cursor: 'pointer' }} />
                </div>

                <button onClick={addBasket}
                    style={{ border: 'none', padding: '10px', backgroundColor: 'rgb(185,76,76)', color: '#fff', borderRadius: '5px', cursor: 'pointer' }}>
                    Sepete Ekle
                </button>
            </div>
        </div>
    )
}

export default ProductDetails