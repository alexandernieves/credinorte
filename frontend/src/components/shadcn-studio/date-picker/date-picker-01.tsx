'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Label } from '@/components/ui/label'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ChevronDownIcon } from 'lucide-react'

interface DatePickerProps {
  value?: Date
  onChange?: (date: Date | undefined) => void
  label?: string
  id?: string
  placeholder?: string
  className?: string
}

const DatePickerDemo = ({
  value,
  onChange,
  label = 'Date picker',
  id = 'date',
  placeholder = 'Pick a date',
  className,
}: DatePickerProps) => {
  const [open, setOpen] = useState(false)
  const [internalDate, setInternalDate] = useState<Date | undefined>(undefined)

  const date = value !== undefined ? value : internalDate
  const setDate = (newDate: Date | undefined) => {
    if (onChange) {
      onChange(newDate)
    } else {
      setInternalDate(newDate)
    }
  }

  return (
    <div className={className || 'flex w-full max-w-xs flex-col gap-2'}>
      {label && (
        <Label htmlFor={id} className='px-1'>
          {label}
        </Label>
      )}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger render={
          <Button variant='outline' id={id} className='w-full justify-between font-normal'>
            {date ? date.toLocaleDateString() : placeholder}
            <ChevronDownIcon />
          </Button>
        } />
        <PopoverContent className='w-auto overflow-hidden p-0' align='start'>
          <Calendar
            mode='single'
            selected={date}
            onSelect={selectedDate => {
              setDate(selectedDate)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default DatePickerDemo
