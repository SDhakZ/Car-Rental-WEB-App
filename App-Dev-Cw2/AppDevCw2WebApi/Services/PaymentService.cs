using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.DTOs.DamagePayments;
using AppDevCw2WebApi.Models;
using AppDevCw2WebApi.Models.Static;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace AppDevCw2WebApi.Services
{
    public class PaymentService
    {
        private readonly AppDbContext _dbContext;

        public PaymentService(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }
        
        // Creates the damage bill for the customer 
        public dynamic CreateNewDamageBill(CreateDamageBillsDto dto, string loggedUsername)
        {

            var paymentId = Guid.NewGuid();
            var dmgRecord = _dbContext.DamageRecord.Find(dto.DamageRecordId);
            if (dmgRecord == null)
            {
                throw new Exception("Invalid record id");
            }
            if (dmgRecord.RequestStatus != RequestStatus.Pending)
            {
                throw new Exception("Damage record status must be pending to create repair bill");
            }
            else
            {
                var checkedBy = _dbContext.ApplicationUsers.Where(user => user.UserName == loggedUsername).First();
                var dmgPayment = new DamagePayment
                {
                    PaymentId = paymentId,
                    PaymentStatus = PaymentStatus.Pending,
                    Amount = dto.Amount,
                    CheckedBy = checkedBy.Id,
                    DamageRecordId = dto.DamageRecordId
                };
                dmgRecord.RequestStatus = RequestStatus.Approved;

                _dbContext.DamagePayment.Add(dmgPayment);
                _dbContext.DamageRecord.Update(dmgRecord);

                _dbContext.SaveChanges();

                return new
                {
                    paymentId = paymentId,
                    paymentStatus = dmgPayment.PaymentStatus,
                    amount = dmgPayment.Amount,
                    checkedBy = dmgPayment.CheckedBy,
                    damageRecordId = dmgPayment.DamageRecordId

                };
            }


        }

        // Checks if the damage payment exists
        private bool DmgPaymentExists(Guid paymentId)
        {
            return _dbContext.DamagePayment.Any(e => e.PaymentId == paymentId);
        }
      
        // Gets all the damage payments based on payment status
        public dynamic GetAllPayments(string? paymentStatus)
        {
            var paymentData = _dbContext.DamagePayment.ToList();
            var validStatus = new List<string> { PaymentStatus.Paid, PaymentStatus.Pending };

            if (paymentStatus != null)
            {
                if (!validStatus.Contains(paymentStatus))
                {
                    throw new Exception("Invalid payment status");
                }

                paymentData = paymentData
                    .Where(p => p.PaymentStatus == paymentStatus)
                    .ToList();
            }

            var paymentDatas = paymentData.Select(data =>
            {
                var damageRecord = _dbContext.DamageRecord.Include(dr => dr.RentalHistory).FirstOrDefault(dr => dr.Id == data.DamageRecordId);
                var checkedBy = _dbContext.ApplicationUsers.Find(data.CheckedBy)!;
                var rentalHistory = damageRecord != null ? _dbContext.RentalHistory.Find(damageRecord.RentalId) : null;
                var car = damageRecord != null ? _dbContext.Cars.Find(damageRecord.RentalHistory.CarId) : null;
                var customer = damageRecord != null ? _dbContext.ApplicationUsers.Find(damageRecord.RentalHistory.CustomerId) : null;

                return new
                {
                    id = data.PaymentId,
                    paymentDate = data.PaymentDate,
                    paymentStatus = data.PaymentStatus,
                    amount = data.Amount,
                    paymentType = data.PaymentType,
                    checkedBy = new
                    {
                        id = checkedBy.Id,
                        name = checkedBy.Name,
                        username = checkedBy.UserName
                    },

                    rentalDetails = new
                    {
                        id = rentalHistory.Id,
                        car = car != null ? new
                        {
                            id = car.Id,
                            name = car.CarName,
                            brand = car.Brand,
                        } : null,
                        customer = customer != null ? new
                        {
                            id = customer.Id,
                            name = customer.Name,
                            username = customer.UserName

                        } : null

                    }

                };
            });

            return paymentDatas;
        }


        // Confirms the offline damage payment of the customer
        public async Task<bool> ConfirmDamagePayment(Guid paymentId, string username, string paymentType = PaymentType.Offline)
        {
            var payment = await _dbContext.DamagePayment.FindAsync(paymentId);

            if (payment == null)
            {
                throw new Exception("Invalid payment id."
                 );
            }

            var dmgRecord = await _dbContext.DamageRecord.FindAsync(payment.DamageRecordId);

            if (dmgRecord == null)
            {
                throw new Exception("Invalid damage record id.");
            }

            if (dmgRecord.RequestStatus != RequestStatus.Approved)
            {
                throw new Exception("Damage record status must be set to 'approved' before payment can be confirmed.");
            }

            if (payment.PaymentStatus != PaymentStatus.Pending)
            {
                throw new Exception("Payment must be marked as 'pending' before it can be confirmed.");
            }

            var validPaymentTypes = new List<string> { PaymentType.Offline, PaymentType.Online };
            if (!validPaymentTypes.Contains(paymentType))
            {
                throw new Exception("Invalid payment type.");
            }

            payment.PaymentStatus = PaymentStatus.Paid;
            payment.CheckedBy = _dbContext.ApplicationUsers.Where(u => username == u.UserName).First().Id;
            dmgRecord.RequestStatus = RequestStatus.Paid;
            payment.PaymentDate = DateTime.UtcNow;
            payment.PaymentType = paymentType;

            _dbContext.Entry(payment).State = EntityState.Modified;
            _dbContext.Entry(dmgRecord).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!DmgPaymentExists(paymentId))
                {
                    throw new Exception(ex.Message
                    );
                }
                else
                {
                    throw;
                }
            }

            return true;
        }

        // Verifies the online damage payment done by customer
        public async Task<dynamic> VerifyPaymentData(string token, double amount, string authUsername, bool isRental = true)
        {

            try
            {

                var url = "https://khalti.com/api/v2/payment/verify/";

                var payload = new Dictionary<string, string>
            {
                { "token", token },
                { "amount", amount.ToString() }
            };

                var client = new HttpClient();
                var khaltiKey = DotNetEnv.Env.GetString("KHALTI_SECRET_KEY");
                client.DefaultRequestHeaders.Add("Authorization", $"Key {khaltiKey}");

                var response = await client.PostAsync(url, new FormUrlEncodedContent(payload));
                var responseContent1 = await response.Content.ReadAsStringAsync();
                var responseContent = JsonConvert.DeserializeObject<Dictionary<string, dynamic>>(responseContent1);



                Dictionary<string, object> responseMap = new Dictionary<string, object>();

                string[] keyValuePairs = responseContent1.Trim('{', '}').Split(',');

                foreach (string keyValuePair in keyValuePairs)
                {
                    string[] keyAndValue = keyValuePair.Split(':');

                    string key = keyAndValue[0].Trim('\"');
                    string value = keyAndValue[1].Trim('\"', '[', ']');

                    if (value.StartsWith("{") && value.EndsWith("}"))
                    {
                        // Nested object
                        responseMap[key] = JsonConvert.DeserializeObject<Dictionary<string, object>>(value);
                    }
                    else
                    {
                        responseMap[key] = value;
                    }
                }



                var statusCode = (int)response.StatusCode;
                if (statusCode == 200)
                {

                    var respAmount = responseMap["amount"];
                    var id = responseMap["product_identity"].ToString();
                    var paymentId = Guid.Parse(id!);
                    var prevPayment = _dbContext.RentalPayment.FirstOrDefault(e => e.PaymentId == paymentId);
                    var paymentResp = await (isRental ? ConfirmRentalPayment(paymentId, authUsername, PaymentType.Online) :
                        ConfirmDamagePayment(paymentId, authUsername, PaymentType.Online));



                    return paymentResp;
                }
                else
                {
                    throw new Exception((responseMap.ContainsKey("amount") ? responseMap["amount"] :
                     responseMap.ContainsKey("token") ? responseMap["token"] : responseMap["detail"]).ToString());
                }
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }

        }

        // Verifies the online rental payment done by customer
        public async Task<bool> ConfirmRentalPayment(Guid paymentId, string authUsername, string paymentType = PaymentType.Offline)
        {
            var payment = await _dbContext.RentalPayment.FindAsync(paymentId);

            if (payment == null)
            {
                throw new Exception("Invalid payment id."
                );
            }

            var rentalHistory = await _dbContext.RentalHistory.FindAsync(payment.RentalId);

            if (rentalHistory == null)
            {
                throw new Exception("Invalid rental history id.");
            }

            if (rentalHistory.RequestStatus != RequestStatus.Approved)
            {
                throw new Exception("Rental history request status must be set to 'approved' before payment can be confirmed.");
            }

            if (payment.PaymentStatus != PaymentStatus.Pending)
            {
                throw new Exception("Payment must be marked as 'pending' before it can be confirmed.");
            }

            var validPaymentTypes = new List<string> { PaymentType.Offline, PaymentType.Online };
            if (!validPaymentTypes.Contains(paymentType))
            {
                throw new Exception("Invalid payment type.");
            }


            payment.PaymentStatus = PaymentStatus.Paid;
            payment.CheckedBy = _dbContext.ApplicationUsers.Where(u => authUsername == u.UserName).First().Id;
            rentalHistory.RequestStatus = RequestStatus.Paid;
            payment.PaymentDate = DateTime.UtcNow;
            payment.PaymentType = paymentType;

            var car = _dbContext.Cars.Find(rentalHistory.CarId)!;
            car.Status = CarStatus.Rented;


            _dbContext.Entry(car).State = EntityState.Modified;

            _dbContext.Entry(payment).State = EntityState.Modified;
            _dbContext.Entry(rentalHistory).State = EntityState.Modified;

            try
            {
                await _dbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!RentalPaymentExists(paymentId))
                {
                    throw new Exception(ex.Message
                    );
                }
                else
                {
                    throw;
                }
            }

            return true;
        }

        // Checks if the rental payment exists
        private bool RentalPaymentExists(Guid paymentId)
        {
            return _dbContext.RentalPayment.Any(e => e.PaymentId == paymentId);
        }

    }
}
