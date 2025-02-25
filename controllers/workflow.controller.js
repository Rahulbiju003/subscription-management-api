import dayjs from 'dayjs';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require('@upstash/workflow/express');
import Subscription from '../models/subscription.model.js';

const REMAINDERS = [7, 5, 2, 1];

export const sendRemainders = serve(async (context) => {
    const { subscriptionID } = context.requestPayload;
    
    const subscription = await fetchSubscription(context, subscriptionID);
    
    // Ensure Subscription Exists
    if (!subscription || subscription.status !== 'active') {
        console.log(`Subscription ${subscriptionID} is not active or not found.`);
        return;
    }
    
    const renewalDate = dayjs(subscription.renewalDate);
    
    // Ensure Renewal Date is in the Future
    if (renewalDate.isBefore(dayjs())) {
        console.log(`Renewal date has passed for ${subscription.user?.email}. Stopping Workflow.`);
        return;
    }
    
    // Only Trigger Reminders When Needed
    for (const daysBefore of REMAINDERS) {
        const reminderDate = renewalDate.subtract(daysBefore, 'day');
        
        if (reminderDate.isAfter(dayjs())) {
            await sleepUntilReminder(context, `Reminder for ${daysBefore}`, reminderDate);
            await triggerReminder(context, `Reminder for ${daysBefore}`);
        }
    }
});

// Safe Fetch Subscription Function
const fetchSubscription = async (context, subscriptionID) => {
    return await context.run('get subscription', async () => {
        try {
            const subscription = await Subscription.findById(subscriptionID).populate('user', 'name email');
            if (!subscription) return null;
            return {
                id: subscription._id,
                status: subscription.status,
                renewalDate: subscription.renewalDate,
                user: {
                    name: subscription.user?.name,
                    email: subscription.user?.email
                }
            };
        } catch (error) {
            console.error(`Error fetching subscription: ${error.message}`);
            return null;
        }
    });
};

// Sleep Until Reminder Function
const sleepUntilReminder = async (context, label, date) => {
    console.log(`Sleeping until ${label} at ${date}`);
    await context.sleepUntil(label, date.toDate());
};

// Trigger Reminder Function
const triggerReminder = async (context, label) => {
    return await context.run(label, async () => {
        console.log(`Triggering ${label}`);
    });
};
