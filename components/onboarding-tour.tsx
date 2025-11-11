"use client"

import { useState, useEffect } from "react"
import { X, ArrowRight, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

export function OnboardingTour() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const hasSeenTour = localStorage.getItem("hasSeenOnboarding")
    if (!hasSeenTour) {
      setIsVisible(true)
    }
  }, [])

  const steps = [
    {
      title: "Bienvenido al Timeline Cripto Argentina",
      description: "Explora 17 años de historia del ecosistema blockchain argentino, desde Bitcoin hasta el presente.",
      icon: "🇦🇷",
    },
    {
      title: "Navega de múltiples formas",
      description:
        "Usa el scroll infinito, salta entre años con la barra lateral, o explora por temas específicos como DeFi, NFTs y más.",
      icon: "🗺️",
    },
    {
      title: "Tu progreso se guarda automáticamente",
      description:
        "Marca eventos como leídos, guarda favoritos y continúa donde lo dejaste. Todo se almacena localmente en tu navegador.",
      icon: "📊",
    },
  ]

  const handleComplete = () => {
    localStorage.setItem("hasSeenOnboarding", "true")
    setIsVisible(false)
  }

  const handleSkip = () => {
    localStorage.setItem("hasSeenOnboarding", "true")
    setIsVisible(false)
  }

  if (!isVisible) return null

  const isLastStep = currentStep === steps.length - 1

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-background border border-primary rounded-lg max-w-lg w-full p-8 relative">
        <button
          onClick={handleSkip}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-8">
          <div className="text-6xl mb-4">{steps[currentStep].icon}</div>
          <h2 className="text-3xl font-bold mb-3">{steps[currentStep].title}</h2>
          <p className="text-lg text-muted-foreground leading-relaxed">{steps[currentStep].description}</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-8">
          {steps.map((_, index) => (
            <div
              key={index}
              className={`h-2 rounded-full transition-all ${index === currentStep ? "w-8 bg-primary" : "w-2 bg-muted"}`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {!isLastStep && (
            <Button variant="ghost" onClick={handleSkip} className="flex-1">
              Saltar
            </Button>
          )}
          <Button
            onClick={isLastStep ? handleComplete : () => setCurrentStep(currentStep + 1)}
            className="flex-1 gap-2"
          >
            {isLastStep ? (
              <>
                <Check className="w-4 h-4" />
                Comenzar
              </>
            ) : (
              <>
                Siguiente
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
