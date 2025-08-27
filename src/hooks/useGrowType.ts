import { useSelector, useDispatch } from 'react-redux'
import { RootState } from '../store/store'
import { setGrowType, setUserPreferences } from '../store/slices/growSlice'

export const useGrowType = () => {
  const dispatch = useDispatch()
  const { growType, experience, timeBudget, budget } = useSelector(
    (state: RootState) => state.grow.userPreferences
  )

  const setGrowTypeHandler = (type: 'indoor' | 'outdoor' | 'greenhouse') => {
    dispatch(setGrowType(type))
  }

  const updateUserPreferences = (preferences: Partial<{
    growType: 'indoor' | 'outdoor' | 'greenhouse'
    experience: 'beginner' | 'intermediate' | 'expert'
    timeBudget: '5min' | '30min' | '60min+'
    budget: 'low' | 'mid' | 'premium'
  }>) => {
    dispatch(setUserPreferences(preferences))
  }

  return {
    growType,
    experience,
    timeBudget,
    budget,
    setGrowType: setGrowTypeHandler,
    updateUserPreferences
  }
}
