---
name: html5-accessibility-checklist
description: Accessibility validation checklist. Load when testing for a11y.
metadata:
  tags: html5, accessibility, a11y, checklist, validation
---

# Accessibility Checklist

## Perceivable

### Images

- [ ] All images have appropriate `alt` text
- [ ] Decorative images have `alt=""` or `role="presentation"`
- [ ] Complex images (charts) have detailed descriptions
- [ ] SVGs have `aria-label` or `<title>`

### Color

- [ ] Color is not the only way to convey information
- [ ] Text has 4.5:1 contrast ratio (normal)
- [ ] Large text has 3:1 contrast ratio
- [ ] UI components have 3:1 contrast

### Text

- [ ] Text can be resized to 200% without loss
- [ ] Line height is at least 1.5
- [ ] Paragraph spacing is at least 2x font size

## Operable

### Keyboard

- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicator is visible
- [ ] No keyboard traps

### Navigation

- [ ] Skip link to main content
- [ ] Page has descriptive title
- [ ] Landmark regions are used
- [ ] Focus management in modals

### Timing

- [ ] No auto-redirect without warning
- [ ] Auto-updating content can be paused
- [ ] Session timeout warnings

## Understandable

### Language

- [ ] HTML `lang` attribute is set
- [ ] Language changes are marked

### Forms

- [ ] All inputs have labels
- [ ] Required fields are indicated
- [ ] Error messages are clear
- [ ] Error prevention for destructive actions

### Predictability

- [ ] Navigation is consistent
- [ ] Components with same function look alike

## Robust

### Validation

- [ ] HTML validates (no errors)
- [ ] ARIA roles are valid
- [ ] Custom components have appropriate roles
- [ ] Name, Role, Value available for components

## Testing

### Automated

- [ ] Lighthouse accessibility score > 90
- [ ] axe DevTools shows no violations
- [ ] WAVE tool shows no errors

### Manual

- [ ] Test with keyboard only
- [ ] Test with screen reader (NVDA/VoiceOver)
- [ ] Zoom to 200%
- [ ] Check color contrast

---

**Accessibility validated. Inclusive by design.**
