import { dateIso10 } from 'shuutils/dist/dates';
import { div, em, h2 } from 'shuutils/dist/dom';

const renderStep = (step: Step): HTMLElement => {
  const el = div('step text-center flex flex-col gap-2 bg-current px-6 py-2');
  el.append(
    em('date-start text-white text-xs opacity-30', dateIso10(step.start))
  );
  el.append(div('title text-white', step.title));
  el.append(em('duration text-white text-xs opacity-30', `${step.days} days`));
  return el;
};

const renderSteps = (steps: Step[]): HTMLElement => {
  const el = div('steps flex');
  steps.forEach((step, index) => {
    const s = renderStep(step);
    if (index === 0) s.classList.add('rounded-l-xl');
    if (index === steps.length - 1) s.classList.add('rounded-r-xl');
    else s.classList.add('mr-1');
    el.append(s);
  });
  return el;
};

const fillData = (group: Group): Group => {
  let date = group.steps[0].start ?? new Date();
  console.log('detected date :', date);
  group.steps.forEach((step) => {
    step.start = new Date(date);
    step.days = step.days ?? 1;
    date.setDate(date.getDate() + step.days);
    step.end = date;
  });
  console.log(group.steps);
  return group;
};

const renderGroup = (group: Group): HTMLElement => {
  const el = div(`group text-${group.color ?? 'indigo'}-700`);
  el.append(h2('text-3xl mb-4', group.title));
  el.append(renderSteps(fillData(group).steps));
  return el;
};

export const render = (el: HTMLElement, data: Data) => {
  el.innerHTML = '';
  for (let group of data.groups) el.append(renderGroup(group));
};
