import mongoose from "mongoose";

const subscriptionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "subscription name is required"],
      trim: true,
      minLength: 2,
      maxLength: 50,
    },
    price: {
      type: Number,
      required: [true, "subscription price is required"],
      min: 0,
      max: 1000,
    },
    currency: {
      type: String,
      enum: ["INR", "USD", "EUR"],
      default: "USD",
      required: [true, "subscription currency is required"],
      trim: true,
      minLength: 2,
      maxLength: 3,
    },
    frequency: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly"],
    },
    category: {
      type: String,
      enum: [
        "sports",
        "news",
        "entertainment",
        "music",
        "lifestyle",
        "education",
        "technology",
      ],
    },
    paymentMethod: {
      type: String,
      required: [true, "subscription payment method is required"],
      trim: true,
    },
    status: {
      type: String,
      enum: ["active", "cancelled", "expired"],
      default: "active",
    },
    startDate: {
      type: Date,
      required: [true, "subscription start date is required"],
      validator: {
        validator: (value) => {
          value <= new Date();
        },
        message: "subscription start date must be in the past",
      }, // custom validator
    },
    renewalDate: {
      type: Date,
      required: [false, "subscription renewal date is required"],
      validator: {
        validator: function (value) {
          return value > this.startDate;
        },
        message: "renewal date must be after start date",
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "subscription user is required"],
      index: true,
    },
  },
  { timestamps: true }
);

// pre-save hook
subscriptionSchema.pre("save", function (next) {
    if(!this.renewalDate){
        const renwalPeriod = {
            daily:1,
            weekly:7,
            monthly:30,
            yearly:365
        };
        this.renewalDate = new Date(this.startDate);
        this.renewalDate.setDate(this.renewalDate.getDate() + renwalPeriod[this.frequency]);// add the frequency to the start date
    }

    if(this.renewalDate < this.startDate){
        this.status = "expired";// if the renewal date is less than the start date, set the status to expired
    }

    next();
});

// creats the model
const Subscription = mongoose.model("Subscription", subscriptionSchema);

export default Subscription;