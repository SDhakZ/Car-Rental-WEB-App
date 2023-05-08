import React, { useState, useEffect } from "react";
import axios from "axios";
import LandingPageCSS from "./LandingPage.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./SwiperJs/SwiperOverride.css";
import { ViewCarCard } from "../ViewCars/ViewCarCard";
import Aos from "aos";
import "aos/dist/aos.css";
import { LoadingPage } from "../../Components/LoadingPage/LoadingPage";
import { ErrorPage } from "../../Components/ErrorPage/ErrorPage";
import { EmptyDataInfo } from "../../Components/EmptyData/EmptyDataInfo";

export const LandingPage = () => {
  useEffect(() => {
    Aos.init({
      duration: "1000",
      easing: "ease-in",
      anchorPlacement: "top-top",
      once: true,
    });
  }, []);

  const host = process.env.REACT_APP_API_HOST;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cars, setCars] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${host}/api/Car/get_cars`);
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
  }, [setCars, host]);

  const filteredCars = cars.filter((car) => car.status === "Available");

  return (
    <>
      <div className={LandingPageCSS["LP-main-container"]}>
        <div className={LandingPageCSS["LP-secondary-container"]}>
          <div className={LandingPageCSS["LP-section1"]}>
            <p className={LandingPageCSS["LP-phrase"]}>
              Drive in style with our premium fleet of luxury cars{" "}
              <span>Rent a car today!</span>
            </p>
            <div className={LandingPageCSS["LP-image-container"]}>
              <img
                className={LandingPageCSS["LP-image"]}
                src={require("../../Assets/faded_bugatti.jpg")}
                alt="img not available"
              />
            </div>
          </div>
          <div data-aos="fade" className={LandingPageCSS["LP-section2"]}>
            <div className={LandingPageCSS["LP-car"]}>
              <img
                src={require("../../Assets/wheel.png")}
                className={LandingPageCSS["LP-wheel1"]}
                alt="img not available"
              />
              <img
                src={require("../../Assets/wheel.png")}
                className={LandingPageCSS["LP-wheel2"]}
                alt="img not available"
              />
              <img
                src={require("../../Assets/body.png")}
                className={LandingPageCSS["LP-body"]}
                alt="img not available"
              />
            </div>
            <div className={LandingPageCSS["LP-headings"]}>
              <p className={LandingPageCSS["LP-heading"]}>
                Welcome to Hajur Ko Car Rental
              </p>
              <p className={LandingPageCSS["LP-subHeading"]}>
                Where you can find
              </p>
            </div>
            <div className={LandingPageCSS["LP-features"]}>
              <div className={LandingPageCSS["LP-individual-features"]}>
                <img
                  className={LandingPageCSS["LP-iconsCost"]}
                  src={require("../../Assets/affordable.png")}
                  alt="img not available"
                />
                <p className={LandingPageCSS["LP-text"]}>Affodable Cars</p>
              </div>
              <div className={LandingPageCSS["LP-individual-features"]}>
                <img
                  className={LandingPageCSS["LP-icons"]}
                  src={require("../../Assets/insurance.png")}
                  alt="img not available"
                />
                <p className={LandingPageCSS["LP-text"]}>Insurance</p>
              </div>
              <div className={LandingPageCSS["LP-individual-features"]}>
                <img
                  className={LandingPageCSS["LP-icons"]}
                  src={require("../../Assets/special_offer.png")}
                  alt="img not available"
                />
                <p className={LandingPageCSS["LP-text"]}>Special Offers</p>
              </div>
            </div>
          </div>
          <div data-aos="fade" className={LandingPageCSS["LP-section3"]}>
            <div className={LandingPageCSS["LP-headings"]}>
              <p className={LandingPageCSS["LP-heading"]}>
                Cars available right now
              </p>
            </div>
            <div>
              {isLoading === true ? (
                <LoadingPage />
              ) : error ? (
                <ErrorPage />
              ) : filteredCars.length === 0 ? (
                <EmptyDataInfo message="No Cars Available For Rent" />
              ) : (
                <Swiper
                  modules={[Navigation, Pagination, Autoplay]}
                  slidesPerView={3}
                  spaceBetween={5}
                  navigation
                  autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                  }}
                  pagination={{ clickable: true }}
                  onSwiper={(swiper) => console.log(swiper)}
                  onSlideChange={() => console.log("slide change")}
                  breakpoints={{
                    0: {
                      slidesPerView: 1,
                    },
                    850: {
                      slidesPerView: 2,
                    },
                    1200: {
                      slidesPerView: 3,
                    },
                  }}
                >
                  {filteredCars.slice(0, 9).map((car) => {
                    return (
                      <SwiperSlide>
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
                          landingPath={"viewCar/"}
                        />
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
