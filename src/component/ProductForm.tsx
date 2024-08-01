import React, { useState, useEffect } from "react";

const ProductForm: React.FC = () => {
  const [input1, setInput1] = useState<number | string>(0);
  const [input2, setInput2] = useState<number | string>(0);
  const [input3, setInput3] = useState<number | string>(0);
  const [product, setProduct] = useState<number>(0);

  useEffect(() => {
    const num1 = typeof input1 === "number" ? input1 : parseFloat(input1);
    const num2 = typeof input2 === "number" ? input2 : parseFloat(input2);
    const num3 = typeof input3 === "number" ? input3 : parseFloat(input3);

    if (!isNaN(num1) && !isNaN(num2) && !isNaN(num3)) {
      setProduct(num1 * num2 * num3);
    } else {
      setProduct(0);
    }
  }, [input1, input2, input3]);

  return (
    <form className="input-form">
      <div>
        <label htmlFor="input1">Input 1:</label>
        <input
          id="input1"
          type="number"
          value={input1}
          onChange={(e) => setInput1(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="input2">Input 2:</label>
        <input
          id="input2"
          type="number"
          value={input2}
          onChange={(e) => setInput2(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="input3">Input 3:</label>
        <input
          id="input3"
          type="number"
          value={input3}
          onChange={(e) => setInput3(e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="product">Product:</label>
        <input id="product" type="number" value={product} readOnly />
      </div>
    </form>
  );
};

export default ProductForm;
