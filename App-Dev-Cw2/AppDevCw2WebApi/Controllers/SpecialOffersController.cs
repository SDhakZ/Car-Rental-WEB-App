using AppDevCw2WebApi.DTOs.OfferDtos;
using AppDevCw2WebApi.Models;
using AppDevCw2WebApi.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;

namespace AppDevCw2WebApi.Controllers
{
    [Route("api/[controller]")]

    public class SpecialOffersController : ControllerBase
    {

        private readonly SpecialOffersService _publishOffers;

        // Constructor for initializing instances of SpecialOffersService
        public SpecialOffersController(SpecialOffersService publishOffers)
        {
            _publishOffers = publishOffers;
        }

        // Add special-offer method
        [Authorize(Roles = "Admin,Staff")]
        [HttpPost]
        [Route("add_offer")]
        public IActionResult AddOffer([FromBody] AddSpecialOffersDto offer)
        {
            try
            {
                var offerView = _publishOffers.AddOffer(offer);
                return Ok(new
                {
                    message = "success",
                    offer = offerView
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });

            }
        }

        // Fetch valid offers
        [HttpGet]
        [Route("get_valid_offers")]
        public IActionResult GetUserOffers()
        {
            try
            {
                var offers = _publishOffers.ViewValidOffers();
                return Ok(
                    new
                    {
                        message = "success",
                        offer = offers
                    }
                    );

            }
            catch (Exception ex)
            {
                return BadRequest(
                    new
                    {
                        message = ex.Message
                    }
                    );
            }

        }

        // Fetch all list of cars
        [Route("view_cars")]
        [Authorize(Roles = "Staff,Admin")]
        [HttpGet]
        public IActionResult GetCarList()
        {
           
                try
            {
                var carList = _publishOffers.GetCarList();
                return Ok(
                    new
                    {
                        message = "success",
                        cars = carList
                    }
                    );

            }
            catch (Exception ex)
            {
                return BadRequest(
                    new
                    {
                        message = ex.Message
                    }
                    );
            }

        }

        // Fetch all the offers
        [Route("get_all_offers")]
        [Authorize(Roles ="Staff,Admin")]
        [HttpGet]
        public IActionResult GetAllOffers()
        {
            try
            {
                var offers = _publishOffers.ViewAllOffers();
                return Ok(
                    new
                    {
                        message = "success",
                        offer = offers
                    }
                    );

            }
            catch (Exception ex)
            {
                return BadRequest(
                    new
                    {
                        message = ex.Message
                    }
                    );
            }

        }


        // Edit the available offers
        [Authorize(Roles = "Admin,Staff")]
        [HttpPatch]
        [Route("update_offer")]
        public IActionResult UpdateOffer([FromBody] UpdateSpecialOfferDto offer)
        {
            try
            {
                var updatedOffer =  _publishOffers.UpdateOffer(offer);
                return Ok(new
                {
                    message = "success",
                    offer = updatedOffer

                });

            }
            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }

        //Remove special-offers
        [Authorize(Roles = "Admin,Staff")]
        [HttpDelete("delete_offer")]
        public IActionResult RemoveOffer(Guid id)
        {
            try
            {
                _publishOffers.RemoveOffer(id);
                return Ok(new
                {
                    message = "success"

                });
            }

            catch (Exception ex)
            {
                return BadRequest(new
                {
                    message = ex.Message
                });
            }
        }
    }
}
