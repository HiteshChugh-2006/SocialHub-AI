import { useState, useEffect, useMemo } from 'react';
import './DateTimePicker.css';

const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DateTimePicker = ({ value, onChange }) => {
  // Parse incoming value or default to current date
  const initialDate = value ? new Date(value) : new Date();
  
  const [currentMonth, setCurrentMonth] = useState(initialDate.getMonth());
  const [currentYear, setCurrentYear] = useState(initialDate.getFullYear());
  
  // Time states
  const [hour, setHour] = useState(
    initialDate.getHours() % 12 === 0 ? 12 : initialDate.getHours() % 12
  );
  const [minute, setMinute] = useState(
    initialDate.getMinutes().toString().padStart(2, '0')
  );
  const [ampm, setAmpm] = useState(initialDate.getHours() >= 12 ? 'PM' : 'AM');
  const [selectedDate, setSelectedDate] = useState(value ? initialDate : null);

  // Helper to trigger onChange with the full date string
  useEffect(() => {
    if (selectedDate) {
      const updated = new Date(selectedDate);
      let h = parseInt(hour);
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      
      updated.setHours(h);
      updated.setMinutes(parseInt(minute));
      updated.setSeconds(0);
      
      // Only fire onChange if the newly calculated time is different from the prop value
      const isoString = updated.toISOString();
      if (!value || new Date(value).toISOString() !== isoString) {
         onChange(isoString);
      }
    } else {
      if (value !== '') onChange('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate, hour, minute, ampm]); 

  const generateCalendar = useMemo(() => {
    const firstDay = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push(null); // empty slots before 1st of month
    }
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  }, [currentMonth, currentYear]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const handleDateSelect = (day) => {
    if (!day) return;
    const newDate = new Date(currentYear, currentMonth, day);
    setSelectedDate(newDate);
  };

  const isToday = (day) => {
    const today = new Date();
    return day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();
  };

  const isSelected = (day) => {
    if (!selectedDate) return false;
    return day === selectedDate.getDate() && currentMonth === selectedDate.getMonth() && currentYear === selectedDate.getFullYear();
  };

  const isPastDay = (day) => {
    if (!day) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of today
    const dateToCheck = new Date(currentYear, currentMonth, day);
    return dateToCheck < today;
  };

  const isTimeInPast = useMemo(() => {
    if (!selectedDate) return false;
    const today = new Date();
    // Only matters if today is selected
    if (
      selectedDate.getDate() === today.getDate() &&
      selectedDate.getMonth() === today.getMonth() &&
      selectedDate.getFullYear() === today.getFullYear()
    ) {
      let h = parseInt(hour || 0);
      if (ampm === 'PM' && h !== 12) h += 12;
      if (ampm === 'AM' && h === 12) h = 0;
      
      const checkDate = new Date();
      checkDate.setHours(h, parseInt(minute || 0), 0, 0);
      return checkDate < today;
    }
    return false;
  }, [selectedDate, hour, minute, ampm]);

  return (
    <div className="datetime-picker">
      {/* ── Left Side: Calendar ── */}
      <div className="datetime-picker__calendar">
        <div className="calendar__header">
          <button type="button" onClick={handlePrevMonth} aria-label="Previous month">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="calendar__title">
            {MONTHS[currentMonth]} {currentYear}
          </div>
          <button type="button" onClick={handleNextMonth} aria-label="Next month">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
        
        <div className="calendar__grid">
          {DAYS.map((day) => (
            <div key={day} className="calendar__day-name">{day}</div>
          ))}
          
          {generateCalendar.map((day, idx) => (
            <button
              key={idx}
              type="button"
              className={`calendar__day ${!day ? 'calendar__day--empty' : ''} ${
                day && isPastDay(day) ? 'calendar__day--disabled' : ''
              } ${day && isToday(day) ? 'calendar__day--today' : ''} ${
                day && isSelected(day) ? 'calendar__day--selected' : ''
              }`}
              onClick={() => handleDateSelect(day)}
              disabled={!day || isPastDay(day)}
            >
              {day || ''}
            </button>
          ))}
        </div>
      </div>

      {/* ── Right Side: Time Picker ── */}
      <div className="datetime-picker__time">
        <div className="time__header">
          Time
          {isTimeInPast && <div className="time__error-text">Cannot be in past</div>}
        </div>
        
        <div className={`time__inputs ${isTimeInPast ? 'time__inputs--error' : ''}`}>
          <div className="time__field">
            <label>Hour</label>
            <input 
              type="number" 
              min="1" max="12" 
              value={hour} 
              onChange={(e) => setHour(e.target.value)} 
            />
          </div>
          <span className="time__colon">:</span>
          <div className="time__field">
            <label>Minute</label>
            <input 
              type="number" 
              min="0" max="59" 
              value={minute} 
              onChange={(e) => setMinute(e.target.value.padStart(2, '0'))} 
            />
          </div>
        </div>

        <div className="time__ampm">
          <button 
            type="button" 
            className={ampm === 'AM' ? 'active' : ''} 
            onClick={() => setAmpm('AM')}
          >
            AM
          </button>
          <button 
            type="button" 
            className={ampm === 'PM' ? 'active' : ''} 
            onClick={() => setAmpm('PM')}
          >
            PM
          </button>
        </div>

        <button 
          className="btn btn-secondary btn-sm time__clear"
          type="button"
          onClick={() => {
            setSelectedDate(null);
            onChange('');
          }}
        >
          Clear Date
        </button>
      </div>
    </div>
  );
};

export default DateTimePicker;
