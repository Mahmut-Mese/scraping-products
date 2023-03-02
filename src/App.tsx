import React, { useState, useEffect } from 'react';

interface Package {
  header: string;
  description: string;
  price: number;
  discount?: string;
}

function PackageList(): JSX.Element {
  const [packages, setPackages] = useState<Package[]>([]);

  useEffect(() => {
    fetch('http://localhost:8000')
      .then(response => response.json())
      .then((data: Package[]) => setPackages(data));
  }, []);

  return (
    <div>
      <h1>Package List</h1>
      <ul>
        {packages.map((pkg: Package, i: number) => (
          <li key={i} data-cy="li">
           <div className="card">
         
           <div className="card__copy">
               <h3 data-cy="header">{pkg.header}</h3>
            
             <p data-cy="description">
             {pkg.description}
             </p>
             <p data-cy="price">{pkg.price}</p>
             {pkg.discount && <h2 data-cy="discount">{pkg.discount}</h2>}
           </div>
         </div>
    
         </li>
          
        ))}
      </ul>
    </div>
  );
}

export default PackageList;
