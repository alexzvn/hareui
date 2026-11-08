<template>
  <div class="flex flex-col items-center gap-3">
    <Sheet
      v-model:open="isOpen"
      :snap-points="snapPoints"
      title="Choose Occupation"
      class="mx-auto max-h-[95vh] max-w-[420px]"
      :ui="{ header: 'px-4 pt-1 pb-2', body: 'flex flex-col p-0' }"
    >
      <Button variant="secondary"> Choose Occupation </Button>
      <template #header>
        <SearchField
          v-model="search"
          full-width
          aria-label="Search occupations"
          placeholder="Search"
          variant="secondary"
        />
      </template>
      <template #body>
        <EmptyState
          v-if="!filtered.length"
          class="flex min-h-32 flex-1 flex-col items-center justify-center gap-2"
        >
          <Icon class="size-5 text-muted" icon="gravity-ui:magnifier" />
          <p class="text-sm text-muted">No occupations match your search.</p>
        </EmptyState>
        <ListBox
          v-else
          aria-label="Occupations"
          class="min-h-0 flex-1 overflow-y-auto p-3"
          :items="filtered"
          :virtualize="{ estimateSize: 36 }"
          @update:model-value="choose"
        />
      </template>
    </Sheet>
    <p class="text-sm text-muted">
      Selected: <span class="font-medium text-foreground">{{ selected }}</span>
    </p>
  </div>
</template>

<script setup lang="ts">
import { Button, EmptyState, ListBox, SearchField, Sheet } from '@hareui/vue'
import { Icon } from '@iconify/vue'
import { computed, ref, watch } from 'vue'

const occupations = [
  'Accountant',
  'Actor',
  'Actuary',
  'Acupuncturist',
  'Aerospace Engineer',
  'Agricultural Scientist',
  'Air Traffic Controller',
  'Aircraft Mechanic',
  'Airline Pilot',
  'Animator',
  'Anthropologist',
  'Archaeologist',
  'Architect',
  'Archivist',
  'Art Director',
  'Astronomer',
  'Athletic Trainer',
  'Audiologist',
  'Baker',
  'Bank Teller',
  'Barber',
  'Barista',
  'Bartender',
  'Biochemist',
  'Biomedical Engineer',
  'Blacksmith',
  'Bookkeeper',
  'Botanist',
  'Bricklayer',
  'Budget Analyst',
  'Bus Driver',
  'Butcher',
  'Carpenter',
  'Cartographer',
  'Chef',
  'Chemical Engineer',
  'Chemist',
  'Chiropractor',
  'Choreographer',
  'Civil Engineer',
  'Claims Adjuster',
  'Composer',
  'Computer Programmer',
  'Construction Manager',
  'Copywriter',
  'Court Reporter',
  'Crane Operator',
  'Curator',
  'Data Scientist',
  'Dental Hygienist',
  'Dentist',
  'Dermatologist',
  'Dietitian',
  'Diplomat',
  'Electrician',
  'Elementary School Teacher',
  'Emergency Medical Technician',
  'Environmental Scientist',
  'Event Planner',
  'Fashion Designer',
  'Film Editor',
  'Financial Analyst',
  'Firefighter',
  'Fitness Instructor',
  'Flight Attendant',
  'Florist',
  'Forester',
  'Geographer',
  'Geologist',
  'Glassblower',
  'Graphic Designer',
  'Hairdresser',
  'Historian',
  'Hotel Manager',
  'Industrial Designer',
  'Insurance Agent',
  'Interior Designer',
  'Interpreter',
  'Jeweler',
  'Journalist',
  'Judge',
  'Landscape Architect',
  'Lawyer',
  'Librarian',
  'Lifeguard',
  'Locksmith',
  'Machinist',
  'Marine Biologist',
  'Marketing Manager',
  'Mathematician',
  'Mechanical Engineer',
  'Meteorologist',
  'Midwife',
  'Musician',
  'Nurse',
  'Nutritionist',
  'Occupational Therapist',
  'Oceanographer',
  'Optometrist',
  'Painter',
  'Paramedic',
  'Pharmacist',
  'Photographer',
  'Physical Therapist',
  'Physician',
  'Physicist',
  'Plumber',
  'Police Officer',
  'Product Manager',
  'Psychologist',
  'Radiologist',
  'Real Estate Agent',
  'Receptionist',
  'Sculptor',
  'Social Worker',
  'Software Developer',
  'Sommelier',
  'Speech Therapist',
  'Statistician',
  'Surgeon',
  'Surveyor',
  'Tailor',
  'Tax Advisor',
  'Translator',
  'Travel Agent',
  'Urban Planner',
  'UX Designer',
  'Veterinarian',
  'Video Game Designer',
  'Web Developer',
  'Welder',
  'Wildlife Biologist',
  'Winemaker',
  'Zookeeper',
  'Zoologist',
].map((label, index) => ({ value: index, label }))

const snapPoints = ['355px']

const isOpen = ref(false)
const search = ref('')
const selected = ref('')

const filtered = computed(() => {
  const query = search.value.trim().toLowerCase()

  return query
    ? occupations.filter((occupation) => occupation.label.toLowerCase().includes(query))
    : occupations
})

const choose = (value: unknown) => {
  const occupation = occupations.find((item) => item.value === value)
  if (!occupation) return

  selected.value = occupation.label
  isOpen.value = false
}

watch(isOpen, (open) => {
  if (!open) search.value = ''
})
</script>
