from scipy import signal
import numpy as np


fs_Hz = 250;
fn = fs_Hz / 2
filtered_data = np.array((150, 1))
data_buffer = "volts"

#######################################
# Filter Creation
# -------------------------------------
#
# Create a filter using the scipy module,
# based on specifications suggested by
# Pan-Tompkins (bandpass from 5-15Hz)
#
#
# 1) Establish constants:
#		a) filter_order = 2
#		b) high pass cutoff = 4Hz
#		c) low pass cutoff = 0.5Hz
# 2) Calculate the coefficients, store in variables

filter_order = 2
f_high = 4
f_low = 0.5
high_pass_coefficients = signal.butter(filter_order, f_low / fn, 'high')
low_pass_coefficients = signal.butter(filter_order, f_high / fn, 'low')


#######################################
# Bandpass filter
# -------------------------------------
# Filter the data, using a bandpass of
# 5-15Hz.
#
# Input:
#			the data buffer from Data_Buffer class
# Output:
#			filtered data as a numpy array


def bandpass(self, data_buffer):
    high_passed = self.high_pass(data_buffer)
    low_passed = self.low_pass(high_passed)
    filtered_data = np.array(low_passed)
    return filtered_data


def high_pass(self, data_buffer):
    [b1, a1] = [self.high_pass_coefficients[0], self.high_pass_coefficients[1]]
    high_passed = signal.filtfilt(b1, a1, data_buffer)
    return high_passed


def low_pass(self, data_buffer):
    [b, a] = [self.low_pass_coefficients[0], self.low_pass_coefficients[1]]
    low_passed = signal.filtfilt(b, a, data_buffer)
    return low_passed


print("test")
