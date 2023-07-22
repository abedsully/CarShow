"use client";
  
import { Carcard, CustomFilter, Hero, Searchbar, Showmore } from '@/components';
import { fetchCars } from '@/utils';
import { fuels, yearsOfProduction } from '@/constants';
import { useEffect } from 'react';
import { useState } from 'react';
import Image from 'next/image';

export default function Home({}) {

  const [allCars, setAllCars] = useState([]);
  const [loading, setLoading] = useState(false);

  const [manufacturer, setManufacturer] = useState("");
  const [model, setModel] = useState("");

  const [fuel, setFuel] = useState("");
  const [year, setYear] = useState(2023);
  
  const [limit, setLimit] = useState(10);

  const getCars = async () => {

    setLoading(true);

     try {
      const result = await fetchCars({manufacturer: manufacturer || '', year: year || 2023, fuel: fuel.toLowerCase() || '', limit: limit || 10, model: model.toLowerCase() || '',
    });

      setAllCars(result);

     } catch (error) {
      console.log(error);

     } finally{
      setLoading(false);
     }

  }

  useEffect(() => {
    console.log(fuel, year, limit, manufacturer, model)
    getCars();
  }, [fuel, year, limit, manufacturer, model])




  // const allCars = await fetchCars({manufacturer: searchParams.manufacturer || '', year: searchParams.year || '2022', fuel: searchParams.fuel || '', limit: searchParams.limit || 10, model: searchParams.model || '',});


  return (
    <main className="overflow-hidden">
     <Hero />

     <div className='mt-12 padding-x padding-y max-width' id='discover'>
      <div className='home__text-container'>
        <h1 className='text-4x1 font-extrabold'>Car Catalogue</h1>
        <p>Explore the cars you might like</p>
      </div>

      <div className='home__filters'>
        <Searchbar setManufacturer={setManufacturer} setModel={setModel}/>

        <div className='home__filter-container'>
          <CustomFilter options={fuels} setFilter={setFuel} />
          <CustomFilter options={yearsOfProduction} setFilter={setYear}/>
        </div>
      </div>

      {allCars.length > 0 ? (
        <section>
          <div className='home__cars-wrapper'>
            {allCars?.map((car) => (<Carcard car={car} /> ))} 
          </div>

          {loading && (
            <div className='mt-16 w-full flex-center'>
              <Image src="/loader.svg" alt="loader" width={50} height={50} className="object-contain" />
            </div>
          )}

          <Showmore pageNumber={limit / 10} isNext={limit  > allCars.length } setLimit={setLimit}/>
        </section>
      ): (
        <div className='home__error-container'>
          <h2 className='text-black text-xl font-bold'>Oops, no results</h2>
          <p>{allCars?.message}</p>
        </div>
      )}




     </div>
    </main>
  )
}
