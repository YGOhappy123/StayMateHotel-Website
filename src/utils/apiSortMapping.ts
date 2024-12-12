const SORT_MAPPING = {
    '-createdAt': { createdAt: 'DESC' },
    '+createdAt': { createdAt: 'ASC' },
    '-price': { price: 'DESC' },
    '+price': { price: 'ASC' },
    '-basePrice': { basePrice: 'DESC'},
    '+basePrice': { basePrice: 'ASC'}
}

const getMappedSort = (sort: string) => {
    return SORT_MAPPING[sort as keyof typeof SORT_MAPPING] ?? {}
}

export { SORT_MAPPING, getMappedSort }
