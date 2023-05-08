using AppDevCw2.Models;
using AppDevCw2WebApi.Data;
using AppDevCw2WebApi.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();


// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("bearerAuth", new OpenApiSecurityScheme
    {

        Type = SecuritySchemeType.ApiKey,
        In = ParameterLocation.Header,
        Name = "Authorization",
        Description = "Standard Authorization header using the Bearer Scheme \"bearer {token}\""
    });

    //options.OperationFilter<SecurityRequirementsOperationFilter>();

    //action.AddSecurityRequirement(new OpenApiSecurityRequirement
    //    {
    //        {
    //            new OpenApiSecurityScheme
    //            {
    //                Reference = new OpenApiReference
    //                {
    //                    Type = ReferenceType.SecurityScheme,
    //                    Id = "bearerAuth"
    //                }
    //            },
    //            Array.Empty<string>()
    //        }
    //    }

    //);
}
);
builder.Services.AddCors();



builder.Services.AddIdentity<IdentityUser, IdentityRole>(options => {
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = true;
    options.Password.RequiredLength = 6;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireLowercase = false;
})
    .AddEntityFrameworkStores<AppDbContext>()
    .AddTokenProvider<DataProtectorTokenProvider<IdentityUser>>(TokenOptions.DefaultProvider);


//Register dbContext
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("ConnString")));


#region JWTconfiguration

//jwt configuration
var jwtSettings = builder.Configuration.GetSection("JWT");

var key = Encoding.UTF8.GetBytes(jwtSettings["Secret"]);

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = builder.Configuration["Jwt:ValidIssuer"],
            ValidAudience = builder.Configuration["Jwt:ValidAudience"],
            //IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("your_secret_key"))
            IssuerSigningKey = new SymmetricSecurityKey(key)
        };
    });

#endregion

// Add the authorization service ==> not working
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("Bearer", new AuthorizationPolicyBuilder()
        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build());
});

builder.Services.AddTransient<ImageService>();
builder.Services.AddTransient<SpecialOffersService>();
builder.Services.AddTransient<CarService>();
builder.Services.AddTransient<DamageRequestService>();
builder.Services.AddTransient<RentalHistoryService>();

builder.Services.AddTransient<AdminService>();
builder.Services.AddTransient<DocUploadService>();
builder.Services.AddTransient<RentRequestService>();
builder.Services.AddTransient<PaymentService>();





DotNetEnv.Env.TraversePath().Load();
var app = builder.Build();

//Add CORS
app.UseCors(builder =>
{
    builder
    .WithOrigins("https://localhost:3000", "https://localhost:3006")
    .SetIsOriginAllowedToAllowWildcardSubdomains()
    .AllowAnyMethod()
    .AllowAnyHeader()
    .AllowCredentials();
});


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);


AppDbInitializer.SeedUsersAndRoles(app).Wait();

app.Run();