import React, { useState, useEffect } from "react";
import ViewCarCSS from "./ViewCar.module.css";
import { ViewCarCard } from "./ViewCarCard";
import { Header } from "../../Components/Header/Header";
import axios from "axios";
import { LoadingPage } from "../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../Components/ErrorPage/ErrorPage";
import { EmptyDataInfo } from "../../Components/EmptyData/EmptyDataInfo";
import Select from "react-select";

export const ViewCar = () => {
  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [cars, setCars] = useState([]);
  const [error, setError] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [brand, setBrand] = useState("");
  const [status, setStatus] = useState("");
  const [brandSortOrder, setBrandSortOrder] = useState("desc");
  const [rateSortOrder, setrateSortOrder] = useState("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [uniqueBrands, setUniqueBrands] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${host}/api/Car/get_cars`, {
          params: {
            brandName: brand,
            fuelType: fuelType,
            status: status,
          },
        });
        if (response.status === 200) {
          setCars(response.data.cars);
        }
      } catch (error) {
        if (error.response && error.response.data) {
          if (error.response.data.message) {
            setError(error.response.data.message);
          } else {
            setError(error.message);
          }
        } else {
          setError(error.message);
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [setCars, host, brand, fuelType, status]);

  const handleSortChange = (value) => {
    if (value === "brand") {
      const sortedData = [...cars].sort((a, b) => {
        if (brandSortOrder === "desc") {
          return a.brand.localeCompare(b.brand);
        } else {
          return b.brand.localeCompare(a.brand);
        }
      });
      setBrandSortOrder(brandSortOrder === "asc" ? "desc" : "asc");
      setCars(sortedData);
    }
    if (value === "rate") {
      const sortedData = [...cars].sort((a, b) => {
        if (rateSortOrder === "asc") {
          return a.ratePerDay - b.ratePerDay;
        } else {
          return b.ratePerDay - a.ratePerDay;
        }
      });
      setrateSortOrder(rateSortOrder === "asc" ? "desc" : "asc");
      setCars(sortedData);
    }
  };

  useEffect(() => {
    const fetchAllBrands = async () => {
      try {
        const response = await axios.get(`${host}/api/Car/get_cars`);
        if (response.status === 200) {
          setUniqueBrands([
            ...new Set(response.data.cars.map((car) => car.brand)),
          ]);
        }
      } catch (error) {
        console.error("Error fetching all brands:", error.message);
      }
    };
    fetchAllBrands();
  }, [host]);

  const filteredCars = cars.filter((car) =>
    car.carName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const customFilter = (option, inputValue) => {
    if (inputValue) {
      return option.label.toLowerCase().includes(inputValue.toLowerCase());
    } else {
      const top5Options = [
        ...new Set(
          cars.slice(0, 5).map((car) => `${car.carName} (${car.brand})`)
        ),
      ].map((label) => ({
        value: label.split(" ")[0],
        label,
      }));
      const isInTop5 = top5Options.some(
        (limitedOption) => limitedOption.value === option.value
      );
      return isInTop5;
    }
  };

  const handleResetFilters = () => {
    setFuelType("");
    setBrand("");
    setStatus("");
    setBrandSortOrder("desc");
    setrateSortOrder("desc");
    setSearchTerm("");
  };

  const handleFuelTypeChange = async (e) => {
    setFuelType(e.target.value);
  };

  const handleBrandChange = async (e) => {
    setBrand(e.target.value);
  };

  const handleStatusChange = async (e) => {
    setStatus(e.target.value);
  };
  return (
    <>
      <div className={ViewCarCSS["VC-main-container"]}>
        <Header headingName="Rent Your Car" />
        <div className={ViewCarCSS["VC-carSlogan-container"]}>
          <img
            className={ViewCarCSS["VC-main-img"]}
            src={require("../../Assets/Lamborghini.png")}
            alt="View Car"
          />
          <h1 className={ViewCarCSS["VC-carSlogan2"]}>
            Discover Freedom, One Trip at a Time: <span></span>
          </h1>
        </div>
        <div className={ViewCarCSS["VC-search-sort"]}>
          <div className={ViewCarCSS["VC-search"]}>
            <Select
              className={ViewCarCSS["VC-searchbar"]}
              options={[
                ...new Set(cars.map((car) => `${car.carName} (${car.brand})`)),
              ].map((label) => ({
                value: label.split(" ")[0],
                label,
              }))}
              onChange={(selectedOption) => {
                setSearchTerm(selectedOption ? selectedOption.value : "");
              }}
              placeholder="Search by Car Name"
              isClearable
              onInputChange={(inputValue) => setSearchTerm(inputValue)}
              filterOption={customFilter}
            />
          </div>
          <div className={ViewCarCSS["VC-sort"]}>
            <b style={{ fontSize: "1.2rem" }}>Sort By: </b>
            <button
              className={ViewCarCSS["VC-individual-sort"]}
              onClick={() => handleSortChange("brand")}
            >
              Brand Name &nbsp;
              {brandSortOrder === "asc" ? "▲" : "▼"}
            </button>
            <button
              className={ViewCarCSS["VC-individual-sort"]}
              onClick={() => handleSortChange("rate")}
            >
              Rate Per Day &nbsp;
              {rateSortOrder === "asc" ? "▲" : "▼"}
            </button>
          </div>
          <div className={ViewCarCSS["VC-sort"]}>
            <b style={{ fontSize: "1.2rem" }}>Filter By: </b>
            <select
              className={ViewCarCSS["VC-individual-filter"]}
              value={fuelType}
              onChange={handleFuelTypeChange}
            >
              <option value="">Select Fuel Type</option>
              <option value="Petrol">Petrol</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
            <select
              className={ViewCarCSS["VC-individual-filter"]}
              value={brand}
              onChange={handleBrandChange}
            >
              <option value="">Select Brand</option>
              {uniqueBrands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
            <select
              className={ViewCarCSS["VC-individual-filter"]}
              value={status}
              onChange={handleStatusChange}
            >
              <option value="">Select Status</option>
              <option value="Available">Available</option>
              <option value="Unavailable">Unavailable</option>
              <option value="Damaged">Damaged</option>
            </select>
            <button
              onClick={handleResetFilters}
              className={ViewCarCSS["VC-reset-button"]}
            >
              Reset Filters
            </button>
          </div>
        </div>
        {isLoading === true ? (
          <LoadingPage />
        ) : error ? (
          <ErrorPage />
        ) : (
          <div className={ViewCarCSS["VC-secondary-container"]}>
            {filteredCars.length === 0 ? (
              <div className={ViewCarCSS["VC-no-car"]}>
                <EmptyDataInfo />
              </div>
            ) : null}
            {filteredCars.map((car) => {
              return (
                <ViewCarCard
                  key={car.id}
                  carId={car.id}
                  carName={car.carName}
                  brand={car.brand}
                  mileage={car.mileage}
                  status={car.status}
                  fuelType={car.fuelType}
                  ratePerDay={car.ratePerDay}
                  color={car.color}
                  safetyRating={car.safetyRating}
                  imageUrl={car.imageUrl}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};
