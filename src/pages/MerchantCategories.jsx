import React, {useState, useEffect} from 'react'
import MerchantDashNavbar from '../components/merchants/MerchantDashNavbar'
import MerchantCategoryBox from '../components/merchants/MerchantCategoryBox'
import { Navigate } from 'react-router-dom';
import Fog from '../components/Fog';
import { IoMdClose } from "react-icons/io";
import ProductCard from '../components/ProductCard';

export default function MerchantCategories() {

  const API_URL = process.env.REACT_APP_API_URL;

  const [merchantData, setMerchantData] = useState({});
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [addProductClicked, setAddProductClicked] = useState(false);
  const [addCategoryClicked, setAddCategodryClicked] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(null);
  const [categoryResponse, setCategoryResponse] = useState(null);
  const [error, setError] = useState(null);
  // Product attributs
  const [categoryProduct, setCategoryProduct] = useState(null);
  const [name, setName] = useState(null);
  const [price, setPrice] = useState(null);
  const [qteStock, setQteStock] = useState(null);
  const [description, setDescription] = useState(null);
  const [status, setStatus] = useState(null);
  const [products, setProducts] = useState([]);
  const [productResponse, setProductResponse] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await fetch(`${API_URL}/merchant/category/all`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des catégories');
      }
      const data = await response.json();
      setCategories(data);
    };
    
    const fetchProducts = async () => {
      const response = await fetch(`${API_URL}/merchant/product/all`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des produits');
      }
      const data = await response.json();
      data.map((product) => products.push(
        <ProductCard 
            name= {product.name}
            description = {product.description}
            category = {product.categoryProduct}
            status = {product.status}
            stock = {product.qteStock}
            price= {product.price}/>
      ));
      console.log(products.length);
    };
    
    fetchCategories();
    fetchProducts();
  }, [API_URL]);


  const isThereAnActiveSession = async () => {
    try {
        const response = await fetch(`${API_URL}/merchant/dashboard`, {
            credentials: 'include',
            method: 'GET'
        });

        if (response.ok) {
            const data = await response.json();
            setIsAuthenticated(true);
            setMerchantData(data.object);
        } else {
            setIsAuthenticated(false);
        }
    } catch (error) {
        console.error('Error:', error);
        setIsAuthenticated(false); 
    }
  }

  useEffect(() => {
    const checkSession = async () => {
        await isThereAnActiveSession();
    };

    checkSession();
  }, []);

  if (isAuthenticated === null) {
      return null; 
  }

  if (isAuthenticated) {
    function handlePrdctBtnClicked() {
      setAddProductClicked(!addProductClicked);
    }
  
    function handleCategoryBtnClicked() {
      setAddCategodryClicked(!addCategoryClicked);
    }
  
    const handleCategorySubmit = async (event) => {
      event.preventDefault();
      const response = await fetch(`${API_URL}/merchant/category/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({userId: 15,
               categoryName: categoryName})
      });
      
      if (response.ok) {
        setCategoryResponse('La catégorie a été créée avec succès');
      } else {
        setCategoryResponse('Erreur lors de la création de la catégorie');
      }
    }
  
    const handleProductSubmit = async (event) => {
      event.preventDefault();
      const response = await fetch(`${API_URL}/merchant/product/create`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          {
            categoryProduct: categoryProduct,
            name: name,
            price: price,
            qteStock: qteStock,
            description: description,
            status: status
          })
      });

      if (response.ok) {
        products.push(
        <ProductCard 
            name= {name}
            description = {description}
            category = {categoryProduct}
            status = {status}
            stock = {qteStock}
            price= {price}/>)
        setProductResponse('Le produit a été créé avec succès');
      } else {
        setProductResponse('Erreur lors de la création du produit');
      }
    }

    return (
      <>
          <Fog elementClicked={addProductClicked} handleElementClick={handlePrdctBtnClicked} />
          <Fog elementClicked={addCategoryClicked} handleElementClick={handleCategoryBtnClicked} />
          <div className={addProductClicked ? "absolute w-full h-full z-40 flex justify-center items-center" : "hidden"} >
            <div className="relative w-[320px] h-[370px] bg-white shadow-my">
              <div className="absolute right-0">
                <IoMdClose className="text-[25px] hover:cursor-pointer" onClick={handlePrdctBtnClicked}/>
              </div>
              <div className="w-[250px] flex flex-col h-full mx-auto justify-center">
                <form onSubmit={handleProductSubmit} className="p-1">
                  <div className="flex flex-col mb-2">
                    <label className="font-semibold text-[13px] lg:text-[14px] ml-1">
                      Catégorie
                    </label>
                    <div className="h-[30px] sm:h-[30px] w-full lg:w-[95%] bg-[#ECECEC] rounded-[5px] font-normal flex items-center">
                      <select name="category" value={categoryProduct}
                      onChange={(event) => setCategoryProduct(event.target.value)}
                      required>
                        <option value="">Sélectionnez une catégorie</option>
                          {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                              {category.categoryName}
                            </option>
                          ))}
                      </select>
                    </div>
                    <label className="font-semibold text-[13px] lg:text-[14px] ml-1">
                      Nom du produit
                    </label>
                    <div className="h-[30px] sm:h-[30px] w-full lg:w-[95%] bg-[#ECECEC] rounded-[5px] font-normal flex items-center">
                      <input
                        type="text"
                        name="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        className="bg-[#ECECEC] rounded-[50px] text-[11px] w-[95%] sm:text-[13px] ml-2 focus:outline-none"
                        required
                      />
                    </div>
                    <label className="font-semibold text-[13px] lg:text-[14px] ml-1">
                      Prix
                    </label>
                    <div className="h-[30px] sm:h-[30px] w-full lg:w-[95%] bg-[#ECECEC] rounded-[5px] font-normal flex items-center">
                      <input
                        type="number"
                        name="price"
                        value={price}
                        onChange={(event) => setPrice(event.target.value)}
                        className="bg-[#ECECEC] rounded-[50px] text-[11px] w-[95%] sm:text-[13px] ml-2 focus:outline-none"
                        required
                      />
                    </div>
                    <label className="font-semibold text-[13px] lg:text-[14px] ml-1">
                      Quantité en stock
                    </label>
                    <div className="h-[30px] sm:h-[30px] w-full lg:w-[95%] bg-[#ECECEC] rounded-[5px] font-normal flex items-center">
                      <input
                        type="number"
                        name="qteStock"
                        value={qteStock}
                        onChange={(event) => setQteStock(event.target.value)}
                        className="bg-[#ECECEC] rounded-[50px] text-[11px] w-[95%] sm:text-[13px] ml-2 focus:outline-none"
                        required
                      />
                    </div>
                    <label className="font-semibold text-[13px] lg:text-[14px] ml-1">
                      Description
                    </label>
                    <div className="h-[30px] sm:h-[30px] w-full lg:w-[95%] bg-[#ECECEC] rounded-[5px] font-normal flex items-center">
                      <input
                        type="text"
                        name="description"
                        value={description}
                        onChange={(event) => setDescription(event.target.value)}
                        className="bg-[#ECECEC] rounded-[50px] text-[11px] w-[95%] sm:text-[13px] ml-2 focus:outline-none"
                        required
                      />
                    </div>
                    <label className="font-semibold text-[13px] lg:text-[14px] ml-1">
                      Status
                    </label>
                    <div className="h-[30px] sm:h-[30px] w-full lg:w-[95%] bg-[#ECECEC] rounded-[5px] font-normal flex items-center">
                      <select name="status" value={status} 
                      onChange={(event) => setStatus(event.target.value)}
                      required>
                        <option value="">Sélectionnez un status</option>
                        <option value="READY" className="text-[13px]">Disponible</option>
                        <option value="EN RUPTURE" className="text-[13px]">En rutpure</option>
                      </select>
                    </div>
                  </div>
                  <div className="w-full lg:w-[95%] flex flex-col items-center mt-1 mb-3">
                    {productResponse && (
                      <p className="ml-1 text-[#ff0000] text-[13px]">{productResponse}</p>
                      )}
                    <button className="text-white bg-[#3C24D1] py-[3px] md:py-[5px] rounded-[5px] font-semibold text-center text-[13px] sm:text-[16px] w-[160px] sm:w-[190px] mt-2 hover:cursor-pointer shadow-md" >Ajouter un produit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className={addCategoryClicked ? "absolute w-full h-full z-40 flex justify-center items-center" : "hidden"} >
            <div className="relative w-[270px] h-[190px] bg-white shadow-my">
              <div className="absolute right-0">
                <IoMdClose className="text-[25px] hover:cursor-pointer" onClick={handleCategoryBtnClicked}/>
              </div>
              <div className="w-[250px] flex flex-col h-full mx-auto justify-center">
                <form onSubmit={handleCategorySubmit} className="p-1">
                  <div className="flex flex-col mb-2">
                    <label className="font-semibold text-[13px] lg:text-[14px] ml-1">
                      Nom de la catégorie
                    </label>
                    <div className="h-[30px] sm:h-[30px] w-full lg:w-[95%] bg-[#ECECEC] rounded-[5px] font-normal flex items-center">
                      <input
                        type="text"
                        name="categoryName"
                        value={categoryName}
                        onChange={(event) => setCategoryName(event.target.value)}
                        className="bg-[#ECECEC] rounded-[50px] text-[11px] w-[95%] sm:text-[13px] ml-2 focus:outline-none"
                        required
                      />
                    </div>
                  </div>
                  <div className="w-full lg:w-[95%] flex flex-col items-center mt-1 mb-3">
                    {categoryResponse && (
                      <p className="ml-1 text-green-500 text-[13px]">{categoryResponse}</p>
                      )}
                    <button className="text-white bg-[#3C24D1] py-[3px] md:py-[5px] rounded-[5px] font-semibold text-center text-[13px] sm:text-[16px] w-[160px] sm:w-[190px] mt-2 hover:cursor-pointer shadow-md" >Ajouter la catégorie</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
         <MerchantDashNavbar /> 
         <div className="flex justify-end w-[96%] items-center">
              <button className="text-white bg-[#3C24D1] py-[3px] md:py-[5px] rounded-[5px] font-semibold text-center text-[13px] sm:text-[16px] md:text-[18px] w-[160px] sm:w-[190px] md:w-[230px] mt-2 hover:cursor-pointer shadow-md md:mr-4 mr-2"onClick={handleCategoryBtnClicked}>Ajouter une catégorie</button>      
              <button className="text-white bg-[#3C24D1] py-[3px] md:py-[5px] rounded-[5px] font-semibold text-center text-[13px] sm:text-[16px] md:text-[18px] w-[160px] sm:w-[190px] md:w-[230px] mt-2 hover:cursor-pointer shadow-md" onClick={handlePrdctBtnClicked}>Ajouter un produit</button>
         </div>
         <div className="flex justify-center items-center">
          {products.length === 0 ? 
          <div className="w-full flex items-center justify-center h-[500px]">
             <p className="opacity-[0.5]">Aucun produit à afficher</p>
          </div> :
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5 md:gap-8 sm:gap-6 flex flex-col mt-6 sm:mt-8">
            {products.map((product) => product)}
          </div>
          }
          
         </div>
      </>
    )    
  }

  return <Navigate to="/merchant/login" replace={true} />
}
