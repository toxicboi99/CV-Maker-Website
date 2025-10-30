// Application State
const appState = {
    currentStep: 1,
    personalDetails: {},
    experiences: {
        resumeObjective: '',
        objectiveDescription: '',
        education: [],
        work: [],
        interests: [],
        references: [],
        skills: [],
        languages: [],
        achievements: '',
        publications: '',
        extras: []
    },
    selectedTemplate: null,
    photoData: null
};

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Clear persisted data on reload (fresh start each visit)
    try { localStorage.removeItem('cvBuilderData'); } catch (e) {}
    initializeEventListeners();
    updateProgressBar();
});

// Event Listeners
function initializeEventListeners() {
    // Step 1 Form
    document.getElementById('personalDetailsForm').addEventListener('submit', handleStep1Submit);
    document.getElementById('photo').addEventListener('change', handlePhotoUpload);

    // Step 2 Navigation
    document.getElementById('prevStep2').addEventListener('click', () => goToStep(1));
    document.getElementById('nextStep2').addEventListener('click', handleStep2Next);

    // Step 2 Add Buttons
    document.getElementById('addEducation').addEventListener('click', addEducationEntry);
    document.getElementById('addWork').addEventListener('click', addWorkEntry);
    document.getElementById('addInterest').addEventListener('click', addInterestEntry);
    document.getElementById('addReference').addEventListener('click', addReferenceEntry);
    document.getElementById('addSkill').addEventListener('click', addSkillEntry);
    document.getElementById('addLanguage').addEventListener('click', addLanguageEntry);
    document.getElementById('addExtraSection').addEventListener('click', addExtraSection);

    // Step 3 Navigation
    document.getElementById('prevStep3').addEventListener('click', () => goToStep(2));
    const previewBtn = document.getElementById('previewResume');
    if (previewBtn) previewBtn.addEventListener('click', handlePreviewClick);
    document.getElementById('downloadResume').addEventListener('click', downloadResume);

    // Reset buttons
    const reset1 = document.getElementById('resetStep1');
    if (reset1) reset1.addEventListener('click', resetStep1);
    const reset2 = document.getElementById('resetStep2');
    if (reset2) reset2.addEventListener('click', resetStep2);
    const resetAll = document.getElementById('resetAll');
    if (resetAll) resetAll.addEventListener('click', resetEverything);

    // Template Selection
    document.querySelectorAll('.template-card').forEach(card => {
        card.addEventListener('click', () => selectTemplate(card.dataset.template));
    });

    // Load saved data
    loadSavedData();
}

// Step Navigation
function goToStep(step) {
    document.querySelectorAll('.step-container').forEach(container => {
        container.classList.remove('active');
    });
    document.getElementById(`step${step}`).classList.add('active');
    appState.currentStep = step;
    updateProgressBar();
}

function updateProgressBar() {
    document.querySelectorAll('.step-circle').forEach((circle, index) => {
        const stepNum = index + 1;
        circle.classList.remove('active', 'completed');
        if (stepNum === appState.currentStep) {
            circle.classList.add('active');
        } else if (stepNum < appState.currentStep) {
            circle.classList.add('completed');
        }
    });
}

// Step 1 Handlers
function handleStep1Submit(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    appState.personalDetails = {};
    for (const [key, value] of formData.entries()) {
        appState.personalDetails[key] = value;
    }
    saveData();
    goToStep(2);
}

function handlePhotoUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
            appState.photoData = event.target.result;
            const preview = document.getElementById('photoPreview');
            preview.innerHTML = `<img src="${appState.photoData}" alt="Profile Photo">`;
        };
        reader.readAsDataURL(file);
    }
}

// Step 2 Handlers
function handleStep2Next() {
    // Save all Step 2 data
    appState.experiences.resumeObjective = document.getElementById('resumeObjective').value;
    appState.experiences.objectiveDescription = document.getElementById('objectiveDescription').value;
    appState.experiences.achievements = document.getElementById('achievements').value;
    appState.experiences.publications = document.getElementById('publications').value;
    appState.experiences.referencesOnRequest = document.getElementById('referencesOnRequest').checked;
    saveData();
    goToStep(3);
}

// Education Entry
function addEducationEntry() {
    const container = document.getElementById('educationEntries');
    const id = Date.now();
    const entryHtml = createEducationEntry(id);
    container.insertAdjacentHTML('beforeend', entryHtml);
    attachEntryListeners(`education-${id}`, 'education');
}

function createEducationEntry(id) {
    return `
        <div class="entry-item" id="education-${id}" data-id="${id}">
            <div class="form-row">
                <div class="form-group">
                    <label>Degree</label>
                    <input type="text" name="degree" placeholder="e.g. Bachelor of Science">
                </div>
                <div class="form-group">
                    <label>City/Town</label>
                    <input type="text" name="city" placeholder="e.g. San Francisco">
                </div>
            </div>
            <div class="form-group">
                <label>School</label>
                <input type="text" name="school" placeholder="e.g. New York University">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Start Date</label>
                    <div class="month-year-group">
                        <select name="startMonth">
                            <option value="">Month</option>
                            ${generateMonthOptions()}
                        </select>
                        <input type="number" name="startYear" placeholder="Year" min="1900" max="2024">
                    </div>
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <div class="month-year-group">
                        <select name="endMonth">
                            <option value="">Month</option>
                            ${generateMonthOptions()}
                        </select>
                        <input type="number" name="endYear" placeholder="Year" min="1900" max="2024">
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" rows="3"></textarea>
            </div>
            <div class="entry-actions">
                <button type="button" class="btn btn-success save-entry">Save</button>
                <button type="button" class="btn btn-danger delete-entry">Delete</button>
            </div>
        </div>
    `;
}

// Work Experience Entry
function addWorkEntry() {
    const container = document.getElementById('workEntries');
    const id = Date.now();
    const entryHtml = createWorkEntry(id);
    container.insertAdjacentHTML('beforeend', entryHtml);
    attachEntryListeners(`work-${id}`, 'work');
}

function createWorkEntry(id) {
    return `
        <div class="entry-item" id="work-${id}" data-id="${id}">
            <div class="form-row">
                <div class="form-group">
                    <label>Job Title</label>
                    <input type="text" name="jobTitle" placeholder="e.g. Sales Manager">
                </div>
                <div class="form-group">
                    <label>City/Town</label>
                    <input type="text" name="city" placeholder="e.g. San Francisco">
                </div>
            </div>
            <div class="form-group">
                <label>Employer</label>
                <input type="text" name="employer" placeholder="e.g. PwC">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Start Date</label>
                    <div class="month-year-group">
                        <select name="startMonth">
                            <option value="">Month</option>
                            ${generateMonthOptions()}
                        </select>
                        <input type="number" name="startYear" placeholder="Year" min="1900" max="2024">
                    </div>
                </div>
                <div class="form-group">
                    <label>End Date</label>
                    <div class="month-year-group">
                        <select name="endMonth">
                            <option value="">Month</option>
                            ${generateMonthOptions()}
                        </select>
                        <input type="number" name="endYear" placeholder="Year" min="1900" max="2024">
                    </div>
                </div>
            </div>
            <div class="form-group">
                <label>Description</label>
                <textarea name="description" rows="3"></textarea>
            </div>
            <div class="entry-actions">
                <button type="button" class="btn btn-success save-entry">Save</button>
                <button type="button" class="btn btn-danger delete-entry">Delete</button>
            </div>
        </div>
    `;
}

// Interest Entry
function addInterestEntry() {
    const container = document.getElementById('interestEntries');
    const id = Date.now();
    const entryHtml = `
        <div class="entry-item" id="interest-${id}" data-id="${id}">
            <div class="form-group">
                <label>Hobby</label>
                <input type="text" name="hobby" placeholder="e.g. Hiking">
            </div>
            <div class="entry-actions">
                <button type="button" class="btn btn-success save-entry">Save</button>
                <button type="button" class="btn btn-danger delete-entry">Delete</button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', entryHtml);
    attachEntryListeners(`interest-${id}`, 'interests');
}

// Reference Entry
function addReferenceEntry() {
    const container = document.getElementById('referenceEntries');
    const id = Date.now();
    const entryHtml = `
        <div class="entry-item" id="reference-${id}" data-id="${id}">
            <div class="form-group">
                <label>Company name</label>
                <input type="text" name="companyName">
            </div>
            <div class="form-group">
                <label>Contact person</label>
                <input type="text" name="contactPerson">
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Phone number</label>
                    <input type="tel" name="phone">
                </div>
                <div class="form-group">
                    <label>Email address</label>
                    <input type="email" name="email">
                </div>
            </div>
            <div class="entry-actions">
                <button type="button" class="btn btn-success save-entry">Save</button>
                <button type="button" class="btn btn-danger delete-entry">Delete</button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', entryHtml);
    attachEntryListeners(`reference-${id}`, 'references');
}

// Skill Entry
function addSkillEntry() {
    const container = document.getElementById('skillEntries');
    const id = Date.now();
    const entryHtml = `
        <div class="entry-item" id="skill-${id}" data-id="${id}">
            <div class="form-row">
                <div class="form-group">
                    <label>Skill</label>
                    <input type="text" name="skill" placeholder="e.g. Microsoft Word">
                </div>
                <div class="form-group">
                    <label>Level</label>
                    <select name="level">
                        <option value="">Select Level</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="Expert">Expert</option>
                    </select>
                </div>
            </div>
            <div class="entry-actions">
                <button type="button" class="btn btn-success save-entry">Save</button>
                <button type="button" class="btn btn-danger delete-entry">Delete</button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', entryHtml);
    attachEntryListeners(`skill-${id}`, 'skills');
}

// Language Entry
function addLanguageEntry() {
    const container = document.getElementById('languageEntries');
    const id = Date.now();
    const entryHtml = `
        <div class="entry-item" id="language-${id}" data-id="${id}">
            <div class="form-row">
                <div class="form-group">
                    <label>Language</label>
                    <input type="text" name="language" placeholder="e.g. Spanish">
                </div>
                <div class="form-group">
                    <label>Level</label>
                    <select name="level">
                        <option value="">Select Level</option>
                        <option value="Basic">Basic</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Fluent">Fluent</option>
                        <option value="Native">Native</option>
                    </select>
                </div>
            </div>
            <div class="entry-actions">
                <button type="button" class="btn btn-success save-entry">Save</button>
                <button type="button" class="btn btn-danger delete-entry">Delete</button>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', entryHtml);
    attachEntryListeners(`language-${id}`, 'languages');
}

// Extra Section
function addExtraSection() {
    const type = document.getElementById('extraSectionType').value;
    if (!type) {
        alert('Please select a section type');
        return;
    }

    const container = document.getElementById('extraSections');
    const id = Date.now();
    const typeLabels = {
        certifications: 'Certifications',
        projects: 'Projects',
        awards: 'Awards',
        volunteer: 'Volunteer Work',
        courses: 'Courses'
    };

    const entryHtml = `
        <div class="section-card">
            <h3>${typeLabels[type]}</h3>
            <div class="entry-item" id="extra-${id}" data-id="${id}" data-type="${type}">
                <div class="form-group">
                    <label>Description</label>
                    <textarea name="description" rows="4"></textarea>
                </div>
                <div class="entry-actions">
                    <button type="button" class="btn btn-success save-entry">Save</button>
                    <button type="button" class="btn btn-danger delete-entry">Delete</button>
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', entryHtml);
    attachEntryListeners(`extra-${id}`, 'extras');
    document.getElementById('extraSectionType').value = '';
}

// Attach Entry Listeners
function attachEntryListeners(entryId, type) {
    const entry = document.getElementById(entryId);
    const saveBtn = entry.querySelector('.save-entry');
    const deleteBtn = entry.querySelector('.delete-entry');

    saveBtn.addEventListener('click', () => saveEntry(entryId, type));
    deleteBtn.addEventListener('click', () => deleteEntry(entryId, type));
}

function saveEntry(entryId, type) {
    const entry = document.getElementById(entryId);
    const inputs = entry.querySelectorAll('input, select, textarea');
    const data = {};
    
    inputs.forEach(input => {
        if (input.name) {
            data[input.name] = input.value;
        }
    });

    data.id = entry.dataset.id;
    
    if (type === 'extras') {
        data.type = entry.dataset.type;
        const existingIndex = appState.experiences.extras.findIndex(e => e.id === data.id);
        if (existingIndex >= 0) {
            appState.experiences.extras[existingIndex] = data;
        } else {
            appState.experiences.extras.push(data);
        }
    } else {
        const existingIndex = appState.experiences[type].findIndex(e => e.id === data.id);
        if (existingIndex >= 0) {
            appState.experiences[type][existingIndex] = data;
        } else {
            appState.experiences[type].push(data);
        }
    }

    entry.classList.add('saved');
    saveData();
    
    // Show save confirmation
    const saveBtn = entry.querySelector('.save-entry');
    const originalText = saveBtn.textContent;
    saveBtn.textContent = 'Saved!';
    saveBtn.style.background = '#28a745';
    setTimeout(() => {
        saveBtn.textContent = originalText;
        saveBtn.style.background = '';
    }, 2000);
}

function deleteEntry(entryId, type) {
    const entry = document.getElementById(entryId);
    const id = entry.dataset.id;

    if (type === 'extras') {
        appState.experiences.extras = appState.experiences.extras.filter(e => e.id !== id);
    } else {
        appState.experiences[type] = appState.experiences[type].filter(e => e.id !== id);
    }

    entry.remove();
    saveData();
}

// Template Selection
function selectTemplate(template) {
    appState.selectedTemplate = template;
    document.querySelectorAll('.template-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-template="${template}"]`).classList.add('selected');
    saveData();
}

// Generate Resume Preview and PDF
function downloadResume() {
    if (!appState.selectedTemplate) {
        alert('Please select a template first');
        return;
    }

    generateResumePreview();
    
    // Wait a bit for the preview to render, then generate PDF
    setTimeout(() => {
        const previewElement = document.getElementById('resumePreview');
        html2canvas(previewElement, {
            scale: 2,
            useCORS: true,
            logging: false
        }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const { jsPDF } = window.jspdf;
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 0;
            
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`${appState.personalDetails.firstName || 'Resume'}_${appState.personalDetails.lastName || 'CV'}.pdf`);
        });
    }, 500);
}

function generateResumePreview() {
    const preview = document.getElementById('resumePreview');
    preview.innerHTML = generateResumeHTML();
    preview.style.display = 'block';
    
    // Scroll to preview
    preview.scrollIntoView({ behavior: 'smooth' });
}

function handlePreviewClick() {
    if (!appState.selectedTemplate) {
        alert('Please select a template first');
        return;
    }
    handleStep2Next; // no-op reference to keep lints away if unused
    generateResumePreview();
}

// Reset helpers
function resetStep1() {
    // Clear state
    appState.personalDetails = {};
    appState.photoData = null;
    // Clear UI fields
    document.getElementById('personalDetailsForm').reset();
    const preview = document.getElementById('photoPreview');
    if (preview) preview.innerHTML = '';
    saveData();
}

function resetStep2() {
    // Reset experiences
    appState.experiences = {
        resumeObjective: '',
        objectiveDescription: '',
        education: [],
        work: [],
        interests: [],
        references: [],
        skills: [],
        languages: [],
        achievements: '',
        publications: '',
        extras: [],
        referencesOnRequest: false
    };
    // Clear dynamic lists
    ['education','work','interest','reference','skill','language'].forEach(key => {
        const el = document.getElementById(`${key}Entries`);
        if (el) el.innerHTML = '';
    });
    // Clear textareas/checkboxes
    const ids = ['resumeObjective','objectiveDescription','achievements','publications','referencesOnRequest'];
    ids.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.type === 'checkbox') el.checked = false; else el.value = '';
    });
    // Clear extras container
    const extras = document.getElementById('extraSections');
    if (extras) extras.innerHTML = '';
    saveData();
}

function resetEverything() {
    try { localStorage.removeItem('cvBuilderData'); } catch (e) {}
    // Reload to fresh state
    window.location.reload();
}

function generateResumeHTML() {
    const pd = appState.personalDetails;
    const exp = appState.experiences;
    
    const templateClass = appState.selectedTemplate ? ` template-${appState.selectedTemplate}` : '';
    let html = `<div class="resume-preview${templateClass}">`;
    
    // Header and layout (varies by template)
    if (appState.selectedTemplate === 'cambridge' || appState.selectedTemplate === 'oxford') {
        // Sidebar two-column layout
        html += '<div class="layout-sidebar">';
        // Sidebar
        html += '<aside class="sidebar">';
        if (appState.photoData) {
            html += `<div class="sidebar-photo"><img src="${appState.photoData}" alt="Profile Photo"></div>`;
        }
        html += `<h1 class="name">${pd.firstName || ''} ${pd.lastName || ''}</h1>`;
        if (pd.jobTitle) {
            html += `<p class="role">${pd.jobTitle}</p>`;
        }
        html += '<div class="sidebar-section">';
        html += '<h3>Contact</h3>';
        if (pd.email) html += `<p>📧 ${pd.email}</p>`;
        if (pd.phone) html += `<p>📱 ${pd.phone}</p>`;
        if (pd.linkedin) html += `<p>🔗 <a href="${pd.linkedin}">LinkedIn</a></p>`;
        if (pd.website) html += `<p>🌐 <a href="${pd.website}">Website</a></p>`;
        if (pd.address || pd.city || pd.zipCode) html += `<p>📍 ${pd.address || ''}${pd.city ? ', ' + pd.city : ''}${pd.zipCode ? ', ' + pd.zipCode : ''}</p>`;
        html += '</div>';

        if (exp.skills.length > 0) {
            html += '<div class="sidebar-section"><h3>Skills</h3>';
            html += '<ul class="list">';
            exp.skills.forEach(skill => {
                if (skill.skill) html += `<li><span>${skill.skill}</span>${skill.level ? `<em>${skill.level}</em>` : ''}</li>`;
            });
            html += '</ul></div>';
        }

        if (exp.languages.length > 0) {
            html += '<div class="sidebar-section"><h3>Languages</h3><ul class="list">';
            exp.languages.forEach(lang => {
                if (lang.language) html += `<li><span>${lang.language}</span>${lang.level ? `<em>${lang.level}</em>` : ''}</li>`;
            });
            html += '</ul></div>';
        }

        if (exp.interests.length > 0) {
            html += '<div class="sidebar-section"><h3>Interests</h3><p>';
            html += exp.interests.map(i => i.hobby).filter(Boolean).join(', ');
            html += '</p></div>';
        }
        html += '</aside>';

        // Main column
        html += '<main class="main">';
        if (exp.resumeObjective || exp.objectiveDescription) {
            html += '<section class="resume-section"><h2>Profile</h2>';
            if (exp.resumeObjective) html += `<p><strong>${exp.resumeObjective}</strong></p>`;
            if (exp.objectiveDescription) html += `<p>${exp.objectiveDescription}</p>`;
            html += '</section>';
        }

        if (exp.work.length > 0) {
            html += '<section class="resume-section"><h2>Work Experience</h2>';
            html += '<div class="timeline">';
            exp.work.forEach(work => {
                html += '<div class="timeline-item">';
                html += '<div class="timeline-dot"></div>';
                html += '<div class="timeline-content">';
                html += `<h3>${work.jobTitle || ''}</h3>`;
                html += `<p class="meta">${work.employer || ''}${work.city ? ', ' + work.city : ''}</p>`;
                if (work.startMonth && work.startYear) {
                    html += `<p class="meta">${getMonthName(work.startMonth)} ${work.startYear} - ${work.endMonth && work.endYear ? getMonthName(work.endMonth) + ' ' + work.endYear : 'Present'}</p>`;
                }
                if (work.description) html += `<p>${work.description}</p>`;
                html += '</div></div>';
            });
            html += '</div></section>';
        }

        if (exp.education.length > 0) {
            html += '<section class="resume-section"><h2>Education</h2>';
            exp.education.forEach(edu => {
                html += '<div class="resume-item">';
                html += `<h3>${edu.degree || ''}</h3>`;
                html += `<p class="meta">${edu.school || ''}${edu.city ? ', ' + edu.city : ''}</p>`;
                if (edu.startMonth && edu.startYear) {
                    html += `<p class="meta">${getMonthName(edu.startMonth)} ${edu.startYear} - ${edu.endMonth && edu.endYear ? getMonthName(edu.endMonth) + ' ' + edu.endYear : 'Present'}</p>`;
                }
                if (edu.description) html += `<p>${edu.description}</p>`;
                html += '</div>';
            });
            html += '</section>';
        }

        if (appState.experiences.referencesOnRequest || exp.references.length > 0) {
            html += '<section class="resume-section"><h2>References</h2>';
            if (appState.experiences.referencesOnRequest) {
                html += '<p>References available on request</p>';
            } else {
                html += '<div class="refs">';
                exp.references.forEach(ref => {
                    html += '<div class="ref">';
                    html += `<p><strong>${ref.contactPerson || ''}</strong></p>`;
                    html += `<p>${ref.companyName || ''}</p>`;
                    if (ref.phone) html += `<p>Phone: ${ref.phone}</p>`;
                    if (ref.email) html += `<p>Email: ${ref.email}</p>`;
                    html += '</div>';
                });
                html += '</div>';
            }
            html += '</section>';
        }

        // Extras, Achievements, Publications in main
        if (exp.achievements) {
            html += '<section class="resume-section"><h2>Achievements</h2><p>' + exp.achievements + '</p></section>';
        }
        if (exp.publications) {
            html += '<section class="resume-section"><h2>Publications</h2><p>' + exp.publications + '</p></section>';
        }
        const extrasByType = {};
        exp.extras.forEach(extra => {
            if (!extrasByType[extra.type]) extrasByType[extra.type] = [];
            extrasByType[extra.type].push(extra);
        });
        Object.keys(extrasByType).forEach(type => {
            const typeLabels = {
                certifications: 'Certifications',
                projects: 'Projects',
                awards: 'Awards',
                volunteer: 'Volunteer Work',
                courses: 'Courses'
            };
            html += `<section class=\"resume-section\"><h2>${typeLabels[type] || type}</h2>`;
            extrasByType[type].forEach(extra => { if (extra.description) html += `<p>${extra.description}</p>`; });
            html += '</section>';
        });

        html += '</main></div>';
    } else if (appState.selectedTemplate === 'edinburgh') {
        html += '<div class="resume-header header-edinburgh">';
        if (appState.photoData) {
            html += `<div class="header-photo"><img src="${appState.photoData}" alt="Profile Photo"></div>`;
        }
        html += '<div class="header-main">';
        html += `<h1>${pd.firstName || ''} ${pd.lastName || ''}</h1>`;
        html += '<div class="contact-row">';
        if (pd.email) html += `<span>📧 ${pd.email}</span>`;
        if (pd.phone) html += `<span>📱 ${pd.phone}</span>`;
        if (pd.linkedin) html += `<span>🔗 <a href="${pd.linkedin}">LinkedIn</a></span>`;
        if (pd.website) html += `<span>🌐 <a href="${pd.website}">Website</a></span>`;
        if (pd.address) html += `<span>📍 ${pd.address}${pd.city ? ', ' + pd.city : ''}${pd.zipCode ? ', ' + pd.zipCode : ''}</span>`;
        html += '</div>';
        html += '</div></div>';
    } else {
        html += '<div class="resume-header">';
        if (appState.photoData) {
            html += `<img src="${appState.photoData}" alt="Profile Photo">`;
        }
        html += `<h1>${pd.firstName || ''} ${pd.lastName || ''}</h1>`;
        html += '<div>';
        if (pd.email) html += `<p>📧 ${pd.email}</p>`;
        if (pd.phone) html += `<p>📱 ${pd.phone}</p>`;
        if (pd.address) html += `<p>📍 ${pd.address}${pd.city ? ', ' + pd.city : ''}${pd.zipCode ? ', ' + pd.zipCode : ''}</p>`;
        if (pd.linkedin) html += `<p>🔗 <a href="${pd.linkedin}">LinkedIn</a></p>`;
        if (pd.website) html += `<p>🌐 <a href="${pd.website}">Website</a></p>`;
        html += '</div></div>';
    }
    
    // Objective
    if (exp.resumeObjective || exp.objectiveDescription) {
        html += '<div class="resume-section"><h2>Objective</h2>';
        if (exp.resumeObjective) html += `<p><strong>${exp.resumeObjective}</strong></p>`;
        if (exp.objectiveDescription) html += `<p>${exp.objectiveDescription}</p>`;
        html += '</div>';
    }
    
    // Education
    if (exp.education.length > 0) {
        html += '<div class="resume-section"><h2>Education</h2>';
        exp.education.forEach(edu => {
            html += '<div class="resume-item">';
            html += `<h3>${edu.degree || ''}</h3>`;
            html += `<p class="meta">${edu.school || ''}${edu.city ? ', ' + edu.city : ''}</p>`;
            if (edu.startMonth && edu.startYear) {
                html += `<p class="meta">${getMonthName(edu.startMonth)} ${edu.startYear} - ${edu.endMonth && edu.endYear ? getMonthName(edu.endMonth) + ' ' + edu.endYear : 'Present'}</p>`;
            }
            if (edu.description) html += `<p>${edu.description}</p>`;
            html += '</div>';
        });
        html += '</div>';
    }
    
    // Work Experience
    if (exp.work.length > 0) {
        html += '<div class="resume-section"><h2>Work Experience</h2>';
        exp.work.forEach(work => {
            html += '<div class="resume-item">';
            html += `<h3>${work.jobTitle || ''}</h3>`;
            html += `<p class="meta">${work.employer || ''}${work.city ? ', ' + work.city : ''}</p>`;
            if (work.startMonth && work.startYear) {
                html += `<p class="meta">${getMonthName(work.startMonth)} ${work.startYear} - ${work.endMonth && work.endYear ? getMonthName(work.endMonth) + ' ' + work.endYear : 'Present'}</p>`;
            }
            if (work.description) html += `<p>${work.description}</p>`;
            html += '</div>';
        });
        html += '</div>';
    }
    
    // Skills
    if (exp.skills.length > 0) {
        html += '<div class="resume-section"><h2>Skills</h2><div class="resume-skills">';
        exp.skills.forEach(skill => {
            html += `<div class="skill-item"><span>${skill.skill || ''}</span><span>${skill.level || ''}</span></div>`;
        });
        html += '</div></div>';
    }
    
    // Languages
    if (exp.languages.length > 0) {
        html += '<div class="resume-section"><h2>Languages</h2>';
        exp.languages.forEach(lang => {
            html += `<p><strong>${lang.language || ''}:</strong> ${lang.level || ''}</p>`;
        });
        html += '</div>';
    }
    
    // Interests
    if (exp.interests.length > 0) {
        html += '<div class="resume-section"><h2>Interests</h2><p>';
        html += exp.interests.map(i => i.hobby).filter(h => h).join(', ');
        html += '</p></div>';
    }
    
    // Achievements
    if (exp.achievements) {
        html += '<div class="resume-section"><h2>Achievements</h2>';
        html += `<p>${exp.achievements}</p></div>`;
    }
    
    // Publications
    if (exp.publications) {
        html += '<div class="resume-section"><h2>Publications</h2>';
        html += `<p>${exp.publications}</p></div>`;
    }
    
    // Extra Sections
    const extrasByType = {};
    exp.extras.forEach(extra => {
        if (!extrasByType[extra.type]) extrasByType[extra.type] = [];
        extrasByType[extra.type].push(extra);
    });
    
    Object.keys(extrasByType).forEach(type => {
        const typeLabels = {
            certifications: 'Certifications',
            projects: 'Projects',
            awards: 'Awards',
            volunteer: 'Volunteer Work',
            courses: 'Courses'
        };
        html += `<div class="resume-section"><h2>${typeLabels[type] || type}</h2>`;
        extrasByType[type].forEach(extra => {
            if (extra.description) html += `<p>${extra.description}</p>`;
        });
        html += '</div>';
    });
    
    // References
    html += '<div class="resume-section"><h2>References</h2>';
    if (exp.referencesOnRequest) {
        html += '<p>References available on request</p>';
    } else if (exp.references.length > 0) {
        exp.references.forEach(ref => {
            html += '<div class="resume-item">';
            html += `<p><strong>${ref.contactPerson || ''}</strong></p>`;
            html += `<p>${ref.companyName || ''}</p>`;
            if (ref.phone) html += `<p>Phone: ${ref.phone}</p>`;
            if (ref.email) html += `<p>Email: ${ref.email}</p>`;
            html += '</div>';
        });
    }
    html += '</div>';
    
    // Additional Info
    if (pd.additionalInfo) {
        html += '<div class="resume-section"><h2>Additional Information</h2>';
        html += `<p>${pd.additionalInfo}</p></div>`;
    }
    
    html += '</div>';
    return html;
}

// Utility Functions
function generateMonthOptions() {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months.map((month, index) => {
        const value = String(index + 1).padStart(2, '0');
        return `<option value="${value}">${month}</option>`;
    }).join('');
}

function getMonthName(monthValue) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                   'July', 'August', 'September', 'October', 'November', 'December'];
    const index = parseInt(monthValue) - 1;
    return months[index] || monthValue;
}

// Data Persistence
function saveData() {
    localStorage.setItem('cvBuilderData', JSON.stringify(appState));
}

function loadSavedData() {
    const saved = localStorage.getItem('cvBuilderData');
    if (saved) {
        const data = JSON.parse(saved);
        Object.assign(appState, data);
        
        // Restore form fields
        if (appState.personalDetails) {
            Object.keys(appState.personalDetails).forEach(key => {
                const field = document.getElementById(key);
                if (field) field.value = appState.personalDetails[key];
            });
        }
        
        if (appState.photoData) {
            document.getElementById('photoPreview').innerHTML = `<img src="${appState.photoData}" alt="Profile Photo">`;
        }
        
        // Restore Step 2 fields
        if (appState.experiences) {
            document.getElementById('resumeObjective').value = appState.experiences.resumeObjective || '';
            document.getElementById('objectiveDescription').value = appState.experiences.objectiveDescription || '';
            document.getElementById('achievements').value = appState.experiences.achievements || '';
            document.getElementById('publications').value = appState.experiences.publications || '';
            document.getElementById('referencesOnRequest').checked = appState.experiences.referencesOnRequest || false;
        }
        
        // Restore entries
        restoreEntries('education', createEducationEntry, addEducationEntry);
        restoreEntries('work', createWorkEntry, addWorkEntry);
        restoreEntries('interests', null, addInterestEntry);
        restoreEntries('references', null, addReferenceEntry);
        restoreEntries('skills', null, addSkillEntry);
        restoreEntries('languages', null, addLanguageEntry);
        
        // Restore template selection
        if (appState.selectedTemplate) {
            selectTemplate(appState.selectedTemplate);
        }
    }
}

function restoreEntries(type, createFn, addFn) {
    if (appState.experiences[type] && appState.experiences[type].length > 0) {
        const container = document.getElementById(`${type}Entries`);
        appState.experiences[type].forEach(entry => {
            addFn();
            const entryElement = container.lastElementChild;
            entryElement.dataset.id = entry.id;
            entryElement.id = `${type}-${entry.id}`;
            
            // Fill in the values
            Object.keys(entry).forEach(key => {
                if (key !== 'id') {
                    const input = entryElement.querySelector(`[name="${key}"]`);
                    if (input) input.value = entry[key];
                }
            });
            
            attachEntryListeners(`${type}-${entry.id}`, type);
            entryElement.classList.add('saved');
        });
    }
}


